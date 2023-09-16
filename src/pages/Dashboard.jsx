import { Badge, Button, Table, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from 'react-highlight-words';
import PageBuilder from "../components/PageBuilder";
import { fetchCases, getCases, getCasesCount } from "../redux/features/case.slice";
import { getPortal } from "../redux/features/portal.slice";
import {
    SearchOutlined
  } from '@ant-design/icons';
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard()
{

    const portal = useSelector(getPortal);
    const [casesPerPage, setCasesPerPage] = useState(localStorage.getItem('results') || 25);
    const [currentPage, setCurrentPage] = useState(1);
    const cases = useSelector(getCases);
    const [serviceFilters, setServiceFilters] = useState([]);
    const [homeFilters, setHomeFilters] = useState([]);
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
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {

        },
        render: text =>
          search.column === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[search.text]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
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
            dataIndex: "Name",
            key: "name",
            ...getColumnSearchProps('Name'),
        },
        {
            title: "Service",
            dataIndex: "Service",
            key: "service",
            filters: serviceFilters,
            onFilter: (value, record) => record.Service === value,
            responsive: ['lg']
        },
        {
            title: "Home",
            dataIndex: "Home",
            key: "home",
            filters: homeFilters,
            onFilter: (value, record) => record.Home === value,
        },
        {
            title: "Director",
            dataIndex: "Director",
            key: "director",
            responsive: ['lg']
        },
        {
            title: "Created",
            dataIndex: "DateCreated",
            key: "created",
            render: (x) => (
                <span>{new Date(x).toLocaleDateString()}</span>
            )
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
        if(cases){
        setServiceFilters([...new Set(cases.map(x => x.Service))].map(x => ({ text: x, value: x})));
        setHomeFilters([...new Set(cases.map(x => x.Home))].map(x => ({ text: x, value: x})))
        }
    }, [cases]);

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID,
                limit: casesPerPage,
                offset: (currentPage - 1) * casesPerPage
            }
            dispatch(fetchCases(payload));
        }
    }, [portal, casesPerPage]);
    console.log(cases);
    return (
        <PageBuilder name='cases'>
            <Table
            onRow={(r) => ({
                onClick: () => navigate("/case/" + r.DisplayID)
            })}
            locale={{
                emptyText: 'No Cases'
            }}
            dataSource={cases}
            columns={columns}
            pagination
            />
        </PageBuilder>
    )
}