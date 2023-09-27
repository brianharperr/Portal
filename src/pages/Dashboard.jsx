import { Badge, Button, Table, Input, Tooltip, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from 'react-highlight-words';
import PageBuilder from "../components/PageBuilder";
import { fetchCases, getCases, getCasesCount } from "../redux/features/case.slice";
import { fetchUsers, getPortal } from "../redux/features/portal.slice";
import {
    SearchOutlined
  } from '@ant-design/icons';
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard()
{

    const portal = useSelector(getPortal);
    const [casesPerPage, setCasesPerPage] = useState(localStorage.getItem('results') || 25);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableLoading, setTableLoading] = useState(true);
    const cases = useSelector(getCases);
    const [filters, setFilters] = useState({
      Services: [],
      Homes: [],
      Directors: []
    });
    const [activeFilters, setActiveFilters] = useState({
      Name: "",
      Status: null,
      Services: [],
      Homes: [],
      Directors: []
    })
    const casesCount = useSelector(getCasesCount);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useState({
        text: '',
        column: ''
    })

    
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined/>}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          (record['Patient'].FirstName + " " + record['Patient'].LastName)
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        render: text =>
          search.column === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[search.text]}
              autoEscape
              textToHighlight={text.FirstName + " " + text.LastName}
            />
          ) : (
            text.FirstName + " " + text.LastName
          ),
      });
    
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearch({
          text: selectedKeys[0],
          column: dataIndex,
        });
      };
    
      const handleReset = clearFilters => {
        clearFilters();
        setSearch({ text: '', column: '' });
      };
    const columns = [
        {
            title: "Case",
            dataIndex: 'DisplayID',
            key: 'case',
            render: (x) => (
                <p>#{x}</p>
            ),
            align: 'left',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.DisplayID - b.DisplayID,
        },
        {
            title: "Name",
            dataIndex: "Patient",
            key: "name",
            ...getColumnSearchProps('Name'),
        },
        {
            title: "Service",
            dataIndex: "Service",
            key: "service",
            render: text => text.Name,
            filters: filters.Services,
            onFilter: (value, record) => record.Service.ID === value,
            responsive: ['lg']
        },
        {
            title: "Home",
            dataIndex: "Home",
            key: "home",
            render: text => text.Name,
            filters: filters.Homes,
            onFilter: (value, record) => record.Home.ID === value,
        },
        {
            title: "Director",
            dataIndex: "User",
            key: "director",
            filters: filters.Directors,
            onFilter: (value, record) => record.User.ID === value,
            render: text => text.FirstName + " " + text.LastName,
            responsive: ['lg']
        },
        {
            title: "Created",
            dataIndex: "DateCreated",
            key: "created",
            render: (x) => (
                <span>{new Date(x).toLocaleDateString()}</span>
            ),
        },
        {
            title: "Status",
            key: 'status',
            render: (x) => (
                <>
                {x.Status !== "Active"
                ?
                <Tooltip title={"Completed " + new Date(x.DateCompleted).toLocaleString()}>
                <Badge status={x.Status === "Active" ? 'processing' : 'success'} text={x.Status} className="underline" />
                </Tooltip>
                :
                <Badge status={x.Status === "Active" ? 'processing' : 'success'} text={x.Status} />
                }
                </>
            ),
            filters: [
                {
                    text: 'Active',
                    value: 'Active'
                },
                {
                    text: 'Complete',
                    value: 'Complete'
                }
            ],
            onFilter: (value, record) => record.Status === value
        }
    ]

    useEffect(() => {
      setTableLoading(true);
        if(portal){
            var payload = {
                id: portal.ID,
                limit: casesPerPage,
                offset: (currentPage - 1) * casesPerPage
            }
            dispatch(fetchCases(payload)).unwrap()
            .then(res => setFilters(res.Filters))
            .finally(() => setTableLoading(false));
        }
    }, [portal, casesPerPage, currentPage]);

    return (
        <PageBuilder name='cases'>
          <div className="py-4 mb-2">
            <Button onClick={() => navigate('/new-case')}>New Case</Button>
          </div>
            <Table
            onRow={(r) => ({
                onClick: () => navigate("/case/" + r.DisplayID)
            })}
            locale={{
                emptyText: 'No Cases'
            }}
            onChange={(pagination, filters, sorters, extra) => {
              setTableLoading(true);
              var payload = {
                id: portal.ID,
                limit: casesPerPage,
                offset: (currentPage - 1) * casesPerPage,
                Services: filters.service,
                Homes: filters.home,
                Directors: filters.director,
                Status: filters.status,
                ...(filters.name && { Name: filters.name[0] })
              }

              dispatch(fetchCases(payload)).unwrap()
              .finally(() => setTableLoading(false));
            }}
            loading={tableLoading}
            dataSource={cases}
            columns={columns}
            pagination={false}
            />
            <br/>
            <Pagination
            className="!float-right"
            total={casesCount}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={casesPerPage}
            current={currentPage}
            onChange={(page, pageSize) => {
              setCasesPerPage(pageSize);
              localStorage.setItem('results', pageSize);
              setCurrentPage(page);
            }}
            showSizeChanger
          />
        </PageBuilder>
    )
}