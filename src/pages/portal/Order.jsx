import { useEffect, useState } from 'react';
import { CssVarsProvider, useColorScheme, useTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { useSearchParams } from "react-router-dom"
import { axiosWithCredentials } from '../../configs/axios';
import { Avatar, Button, Card, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, Divider, Dropdown, FormControl, FormLabel, Grid, IconButton, Input, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Menu, MenuButton, MenuItem, Modal, ModalDialog, Option, RadioGroup, Select, Skeleton, Stack, Step, StepButton, StepIndicator, Stepper, Tab, TabList, TabPanel, Tabs, Textarea, Tooltip } from '@mui/joy';
import { Check, CircleOutlined, KeyboardArrowDown, KeyboardArrowUp, WarningRounded, EditRounded, FileCopyOutlined, DoDisturbAltOutlined, DeleteOutline } from '@mui/icons-material';
import TaskPanel from '../../components/order/TaskPanel';
import { fetchUsers } from '../../redux/features/user.slice';
import { useDispatch } from 'react-redux';
import TaskPanel2 from '../../components/order/TaskPanel2';
import GenericListItem from '../../components/order/GenericListItem';
import PatientModal from '../../components/modals/PatientModal';
import ContactModal from '../../components/modals/ContactModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

const chipColor = {
    Active: 'success',
    Cancelled: 'danger',
    Complete: 'primary'
}

export default function Order()
{
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [order, setOrder] = useState();
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [openTask, setOpenTask] = useState(null);
    const [editPatient, setEditPatient] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [editProcessing, setEditProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const updateDeceased = (data) => {
        setOrder({...order, Patient: data});
        setEditPatient(false);
    }
    const updateContact = (data) => {
        setOrder({...order, Contact: data});
        setEditContact(false);
    }

    const updateProcessing = (data) => {
        setOrder(data);
        setEditProcessing(false);
    }

    const updateStatus = (data) => {
        var prevStatus = order.Status;
        var payload = {
            ID: order.ID,
            Status: data
        }
        setOrder(prevOrder => ({
            ...prevOrder,
            Status: data
        }))
        axiosWithCredentials.patch('/case/status', payload)
        .then(() => {
        })
        .catch(() => {
            setOrder(prevOrder => ({
                ...prevOrder,
                Status: prevStatus
            }))
        });
    }

    const deleteOrder = () => {
        axiosWithCredentials.delete('/case', { params: { id: order.ID }})
        .then(() => {
            window.location.href = "/orders";
        })
        .finally(() => {
            setDeleteConfirmation(false)
        })
    }

    function duplicateOrder()
    {
        var payload = {
            ID: order.ID
        }
        axiosWithCredentials.post('/case/duplicate', payload);
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

    useEffect(() => {
        axiosWithCredentials.get('/case', { params: { id }})
        .then(res => {
            setOrder(res.data)
        }).finally(() => setLoading(false))


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
                        <Button variant="solid" color="danger" onClick={() => setDeleteConfirmation(true)}>
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
              overflowY: 'auto'
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
            <DeleteConfirmationModal open={deleteConfirmation} onClose={() => setDeleteConfirmation(false)} onConfirm={() => deleteOrder()} label="Are you sure you want to delete this order?" deleteLabel="Delete"/>
            <PatientModal patient={order?.Patient} open={editPatient} onClose={() => setEditPatient(false)} onSuccess={(data) => updateDeceased(data)}/>
            <ContactModal contact={order?.Contact} open={editContact} onClose={() => setEditContact(false)} onSuccess={(data) => updateContact(data)}/>
            <ProcessingModal data={order} open={editProcessing} onClose={() => setEditProcessing(false)} onSuccess={(data) => updateProcessing(data)}/>
            <Stack direction={'row'} sx={{ marginTop: 6}}>
                {loading ?
                <Skeleton variant='text' level='h3' width='20%'/>
                :
                <Stack direction='row' sx={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                <Stack direction='row' sx={{ gap: 1, alignItems: 'center'}}>
                <Typography level='h3'>ORD-{order?.DisplayID}: {order?.Patient.FirstName + " " + order?.Patient.LastName}</Typography>
                <div><Chip color={chipColor[order?.Status]} variant={order?.Status === 'Complete' ? 'solid' : 'outlined'} size='md'>{order?.Status}</Chip></div>
                </Stack>
                <Select variant='outlined' value={order?.Status} onChange={(e, data) => updateStatus(data)}>
                    <Option color='primary' value="Complete">Complete</Option>
                    <Option color='success' value="Active">Active</Option>
                    <Option color='danger' value="Cancelled">Cancelled</Option>
                </Select>
                </Stack>
                }
            </Stack>
            <Grid container spacing={4} sx={{ flexGrow: 1, marginTop: 0 }}>
                <Grid container xs={12} lg={8} spacing={2} direction='column'>
                    <Grid xs={12}>
                    <Card>
                        <Stack direction="horizontal" alignItems="center" justifyContent="space-between">
                        <Typography level="title-lg">Deceased Details</Typography>
                        <IconButton onClick={() => setEditPatient(true)}>
                            <EditRounded/>
                        </IconButton>
                        </Stack>
                        <Divider inset="none" />
                        <Grid container sx={{ overflow: 'hidden' }}>
                            <Grid xs={12} sm={6}>
                                <List orientation='vertical'>
                                    <GenericListItem loading={loading} title="First Name" value={order?.Patient.FirstName}/>
                                    <GenericListItem loading={loading} title="Middle Name" value={order?.Patient.MiddleName}/>
                                    <GenericListItem loading={loading} title="Last Name" value={order?.Patient.LastName}/>
                                    <GenericListItem loading={loading} title="Sex" value={order?.Patient.Sex}/>
                                </List>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <List orientation='vertical'>
                                    <GenericListItem loading={loading} title="Age" value={order?.Patient.Age}/>
                                    <GenericListItem loading={loading} title="Residence" value={order?.Patient.Residence}/>
                                    <GenericListItem loading={loading} title="Cause of Death" value={order?.Patient.CauseOfDeath}/>
                                    <GenericListItem loading={loading} title="Date of Death" value={order?.Patient.DateOfDeath} date/>
                                </List>
                            </Grid>
                        </Grid>
                    </Card>
                    </Grid>
                    <Grid xs={12}>
                    <Card>
                    <Stack direction="horizontal" alignItems="center" justifyContent="space-between">
                    <Typography level="title-lg">Contact Details</Typography>
                    <IconButton onClick={() => setEditContact(true)}>
                        <EditRounded/>
                    </IconButton>
                    </Stack>
                    <Divider inset="none" />
                    <Grid container>
                        <Grid xs={12} sm={6}>
                            <List orientation='vertical'>
                                <GenericListItem loading={loading} title="First Name" value={order?.Contact.FirstName}/>
                                <GenericListItem loading={loading} title="Last Name" value={order?.Contact.LastName}/>
                                <GenericListItem loading={loading} title="Relation" value={order?.Contact.Relation}/>
                            </List>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <List orientation='vertical'>
                                <GenericListItem loading={loading} title="Phone Number" value={order?.Contact.PhoneNumber} phoneNumber/>
                                <GenericListItem loading={loading} title="Email" value={order?.Contact.Email}/>
                            </List>
                        </Grid>
                    </Grid>
                    </Card>
                    </Grid>
                    <Grid xs={12}>
                        <Card>
                            <Stack direction="horizontal" alignItems="center" justifyContent="space-between">
                            <Typography level="title-lg">Processing Details</Typography>
                            <IconButton onClick={() => setEditProcessing(true)}>
                                <EditRounded/>
                            </IconButton>
                            </Stack>
                            <Divider inset="none" />
                            <div>
                                <List orientation='vertical'>
                                    <GenericListItem loading={loading} title="Home" value={order?.Home.Name}/>
                                    <GenericListItem loading={loading} title="Service" value={order?.Service.Name} tooltip tooltipText={order?.Service.Description}/>
                                    <GenericListItem loading={loading} title="Director" value={order?.User.FirstName + " " + order?.User.LastName}/>
                                    <GenericListItem loading={loading} title="Prearranged" value={order?.PreArranged == 1 ? "Yes" : "No"}/>
                                </List>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
                <Grid direction="column" container xs={12} lg={4} spacing={2}>
                    <Grid xs={12}>
                        <Card>
                            <Stack direction="horizontal" alignItems="center" justifyContent="space-between">
                            <Typography level="title-lg">Quick Actions</Typography>
                            </Stack>
                            <Divider inset="none" />
                            <List size='sm'>
                                <ListItem>
                                    <Tooltip title="Work in progress">
                                    <ListItemButton onClick={() => duplicateOrder()}>
                                        <ListItemDecorator><FileCopyOutlined/></ListItemDecorator>
                                        <ListItemContent>Duplicate Order</ListItemContent>
                                    </ListItemButton>
                                    </Tooltip>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton onClick={() => updateStatus("Cancelled")}>
                                        <ListItemDecorator><DoDisturbAltOutlined/></ListItemDecorator>
                                        <ListItemContent>Cancel Order</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton color='danger' onClick={() => setDeleteConfirmation(true)}>
                                        <ListItemDecorator><DeleteOutline/></ListItemDecorator>
                                        <ListItemContent>Delete Order</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                    <Grid xs={12}>
                        <Card>
                            <Typography level="title-sm">Tasks</Typography>
                            <Stepper size='sm' orientation="vertical">
                                {order?.Tasks.map((task,idx) => {
                                    return (
                                        <>
                                        <Step
                                        indicator={
                                            <Checkbox sx={{ marginRight: 1 }} checked={task.DateCompleted} onChange={e => updateTaskStatus(task.ID, task.DateCompleted ? "Active": "Complete")}/>
                                        }
                                        >
                                            <div className='hover:cursor-pointer' onClick={() => setOpenTask(openTask !== task ? task : null)}>
                                            <div>
                                            <Typography sx={{ display: 'flex', alignItems: 'center' }} level="title-sm">{task.Name}{task.ID === openTask?.ID ? <KeyboardArrowUp/> : <KeyboardArrowDown/> }</Typography>
                                            </div>
                                            </div>
                                        </Step>
                                        <Stack
                                        className={` rounded block box-border overflow-hidden ${task.ID === openTask?.ID ? 'h-full' : 'h-[0px] '}`}
                                        >
                                            <TaskPanel2 task={task}/>
                                        </Stack>
                                        </>
                                    )
                                })}
                            </Stepper>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
          </Box>
        </Box>
      </CssVarsProvider>
    )
}