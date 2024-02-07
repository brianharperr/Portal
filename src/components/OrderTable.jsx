/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useNavigate } from 'react-router-dom';
import { axiosWithCredentials } from '../configs/axios';
import { useDispatch, useSelector } from 'react-redux';
import { getPortal } from '../redux/features/portal.slice';
import { LinearProgress, Skeleton } from '@mui/joy';
import { downloadReport, downloadTags } from '../redux/features/case.slice';

function RowMenu({ payload, id }) {

  const dispatch = useDispatch();
  function fetchReport(payload){
    var payload = {
        DisplayID: payload.DisplayID,
        PortalID: id,
        Name: payload?.DeceasedName,
    }
    dispatch(downloadReport(payload));
  }

  function fetchTags(payload){
    var payload = {
      ID: payload.ID,
      Name: payload?.DeceasedName,
    }
    dispatch(downloadTags(payload));
  }
  
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={() => fetchReport(payload)}>Download Report</MenuItem>
        <MenuItem onClick={() => fetchTags(payload)}>Download Tags</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderTable() {

  const navigate = useNavigate();

  const [rows, setRows] = React.useState([]);
  const [pageView, setPageView] = React.useState(20);
  const [page, setPage] = React.useState(0);
  const [totalResults, setTotalResults] = React.useState(null);
  const [filters, setFilters] = React.useState({
    Homes: [],
    Services: [],
    Directors: [],
    Statuses: []
  });
  const [homeFilter, setHomeFilter] = React.useState(null);
  const [serviceFilter, setServiceFilter] = React.useState(null);
  const [directorFilter, setDirectorFilter] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState(null);
  const [nameFilter, setNameFilter] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const portal = useSelector(getPortal);
  const [order, setOrder] = React.useState('desc');
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
          onChange={(e, data) => setStatusFilter(data)}
        >
          <Option value={null}>All</Option>
          {filters.Statuses?.map(x => {
            return (
              <Option value={x.Status}>{x.Status}</Option>
            )
          })
          }
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Service</FormLabel>
        <Select size="sm" placeholder="All" sx={{ maxWidth: 250 }} slotProps={{listbox: { placement: 'bottom-start'}}} onChange={(e, data) => setServiceFilter(data)}>
          <Option value={null}>All</Option>
          {filters.Services?.map(x => {
            return (
              <Option value={x.ID}>{x.Name}</Option>
            )
          })
          }
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Home</FormLabel>
        <Select size="sm" placeholder="All" sx={{ maxWidth: 240 }} slotProps={{listbox: { placement: 'bottom-start'}}} onChange={(e, data) => setHomeFilter(data)}>
        <Option value={null}>All</Option>
          {filters.Homes?.map(x => {
            return (
              <Option value={x.ID}>{x.Name}</Option>
            )
          })
          }
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Director</FormLabel>
        <Select size="sm" placeholder="All" sx={{ maxWidth: 160 }} slotProps={{listbox: { placement: 'bottom-start'}}} onChange={(e, data) => setDirectorFilter(data)}>
        <Option value={null}>All</Option>
          {filters.Directors?.map(x => {
            return (
              <Option value={x.ID}>{x.Name}</Option>
            )
          })
          }
        </Select>
      </FormControl>
    </React.Fragment>
  );

  const formatPhoneNumber = (phoneNumber) => {
    // Use regex to insert dashes at specific positions
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  const formatDate = (datestring) => {
    return new Date(datestring).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }); 
  }

  const formatContactInfo = (email, phoneNumber) => {
    // Check if either email or phoneNumber is present
    if (email || phoneNumber) {
      // Use filter to remove null/undefined values
      const nonNullValues = [email, phoneNumber].filter(value => value !== null && value !== undefined);
      
      // Join the non-null values with " | " separator
      return nonNullValues.join(' | ');
    } else {
      // If both email and phoneNumber are missing, return an empty string
      return '';
    }
  }

  function fetchData(){
    if(portal){
      setLoading(1);
      var payload = {
        id: portal.ID,
        limit: pageView,
        offset: page * pageView,
        name: nameFilter,
        home: homeFilter,
        service: serviceFilter,
        director: directorFilter,
        status: statusFilter
      }
      axiosWithCredentials.get('/procedure/order-table', { params: payload })
      .then(res => {
        setRows(res.data.data);
        setTotalResults(res.data.count[0].Count);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
    }
  }

  React.useEffect(() => {

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [nameFilter])

  React.useEffect(() => {
    fetchData();
  }, [homeFilter, serviceFilter, directorFilter, directorFilter, statusFilter, page, pageView])

  React.useEffect(() => {
    if(portal){
      fetchData();
      axiosWithCredentials.get('/procedure/order-table-filters', { params: { id: portal.ID } })
      .then(res => {
        setFilters(res.data);
      })
      .catch(err => console.log(err))
    }
  }, [portal])

  React.useF
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      {!loading && rows.length === 0 &&
      "No orders here."
      }
        <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input value={nameFilter} size="sm" placeholder="Search" startDecorator={<SearchIcon />} onChange={(e) => setNameFilter(e.target.value)} />
        </FormControl>
        {renderFilters()}
      </Box>
      {loading && <Sheet><LinearProgress/></Sheet>}
      {!loading && rows.length > 0 &&
      <>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.DisplayID) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Order
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Deceased</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Customer</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.DisplayID}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{formatDate(row.DateCreated)}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Paid: <CheckRoundedIcon />,
                        Refunded: <AutorenewRoundedIcon />,
                        Cancelled: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Complete: 'success',
                        Refunded: 'neutral',
                        Paused: 'danger',
                      }[row.Status]
                    }
                  >
                    {row.Status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row.DeceasedName?.charAt(0)}</Avatar>
                    <div>
                      <Typography level="body-xs">{row.DeceasedName}</Typography>
                      <Typography level="body-xs">{row.PreArranged === 1 ? "Pre-Arranged": null}</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row.ContactName?.charAt(0) ? row.ContactName?.charAt(0) : null}</Avatar>
                    <div>
                      <Typography level="body-xs">{row.ContactName}</Typography>
                      <Typography level="body-xs">{formatContactInfo(row.Email, formatPhoneNumber(row.PhoneNumber))}</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button" onClick={() => navigate('/case/' + row.id)}>
                      Edit
                    </Link>
                    <RowMenu payload={row} id={portal.ID} />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      {totalResults > pageView &&
        <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {[...Array(Math.ceil(totalResults/pageView))].map((x, i) => (
          <IconButton
            key={i}
            size="sm"
            variant={Number(i + 1) ? 'outlined' : 'plain'}
            color={page === i ? 'primary' : 'neutral'}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          disabled={page + 1 === Math.ceil(totalResults/pageView)}
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
      }
  </>
      }
    </React.Fragment>
  );
}