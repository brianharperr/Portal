import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import { useSearchParams } from "react-router-dom"
import { axiosWithCredentials } from '../configs/axios';
import { Avatar, Button, Chip, DialogActions, DialogContent, DialogTitle, Divider, Dropdown, FormControl, FormLabel, Input, List, ListItem, Menu, MenuButton, MenuItem, Modal, ModalDialog, Option, RadioGroup, Select, Skeleton, Stack, Step, StepIndicator, Stepper, Tab, TabList, TabPanel, Tabs, Textarea } from '@mui/joy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { Circle, CircleOutlined, Delete, Download, WarningRounded } from '@mui/icons-material';
import TaskPanel from '../components/order/TaskPanel';
import { fetchUsers } from '../redux/features/user.slice';
import { useDispatch } from 'react-redux';
export default function Order()
{
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [employees, setEmployees] = useState([]);
    const [order, setOrder] = useState();
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const dispatch = useDispatch();
    
    function formatDate(dateString) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(dateString);
        
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12; // Handle midnight
      
        const formattedDate = `${day} ${months[monthIndex]} ${year} ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      
        return formattedDate;
    }

    function updateTaskStatus(id, status)
    {
        var payload = {
            ID: id,
            Status: status
        }
        axiosWithCredentials.patch('/case/task/status', payload)
        .then(res => {
            setOrder(prevOrder => {
                const updatedTasks = prevOrder.Tasks.map(task => {
                    if (task.ID === res.data.ID) {
                        return { ...task, DateCompleted: res.data.DateCompleted, CompletedBy: res.data.CompletedBy }; // Assuming response contains updated status
                    }
                    return task;
                });
                return { ...prevOrder, Tasks: updatedTasks };
            });
        })
    }

    function deleteOrder()
    {

        window.location.href = "/orders"
    }

    useEffect(() => {
        axiosWithCredentials.get('/case', { params: { id }})
        .then(res => {
            setOrder(res.data)
        })


        dispatch(fetchUsers());

    }, [])

    return (
        <CssVarsProvider disableTransitionOnChange>
            <Modal open={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRounded />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Are you sure you want to delete this order?
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="danger" onClick={() => deleteOrder()}>
                        Delete order
                        </Button>
                        <Button variant="plain" color="neutral" onClick={() => setDeleteConfirmation(false)}>
                        Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
                </Modal>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 2, md: 6 },
              pt: {
                xs: 'calc(12px + var(--Header-height))',
                sm: 'calc(12px + var(--Header-height))',
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: '100dvh',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Breadcrumbs
                size="sm"
                aria-label="breadcrumbs"
                separator={<ChevronRightRoundedIcon fontSize="sm" />}
                sx={{ pl: 0 }}
              >
                <Link
                  underline="hover"
                  color="neutral"
                  href="/orders"
                  fontSize={12}
                  fontWeight={500}
                >
                  Orders
                </Link>
                <Typography color="primary" fontWeight={500} fontSize={12}>
                {id}
                </Typography>
              </Breadcrumbs>
            </Box>
            <Tabs orientation='vertical' sx={{maxWidth: 600}}>
                <TabList>
                {order?.Tasks.map(task => {
                    return (
                        <Tab
                        >
                            {task.DateCompleted ?
                            <CheckCircleIcon color='primary' onClick={() => updateTaskStatus(task.ID, 'Active')}/>
                            :
                            <CircleOutlined color='neutral' onClick={() => updateTaskStatus(task.ID, 'Complete')}/>
                            }
                            <Typography level="title-sm">{task.Name}</Typography>
                        </Tab>
                    )
                })}
                </TabList>
                {order?.Tasks.map((task, idx) => {
                    return (
                        <TaskPanel employees={employees} task={task} id={idx}/>
                    )
                })}
            </Tabs>
          </Box>
        </Box>
      </CssVarsProvider>
    )
}