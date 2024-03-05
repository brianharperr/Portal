import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, Input, Select, Option, FormControl, FormLabel, Button, FormHelperText, Grid, ModalClose, Checkbox } from "@mui/joy";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from "react";
import { axiosWithCredentials } from "../../configs/axios";
import { useSelector } from "react-redux";
import { getPortal } from "../../redux/features/portal.slice";

export default function ProcessingModal({ data, open, onClose, onSuccess })
{
    const [submitLoading, setSubmitLoading] = useState(false);
    const portal = useSelector(getPortal);
    const [options, setOptions] = useState();
    const schema = z.object({
        Home: z.number().int(),
        Service: z.number().int(),
        User: z.number().int(),
        PreArranged: z.boolean(),
    });

    const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    
    const onSubmit = (changes) => {
        setSubmitLoading(true);
        var payload = {
            ...changes,
            ID: data.ID,
            PreArranged: changes.PreArranged ? 1 : 0
        }
        axiosWithCredentials.patch('/case/processing', payload)
        .then(res => {
            onSuccess(res.data);
        })
        .finally(() => setSubmitLoading(false))
    };

    useEffect(() => {
        if(data){
            reset({
                Home: data.Home.ID,
                Service: data.Service.ID,
                User: data.User.ID,
                PreArranged: data.PreArranged ? true : false,
            })
        }
    }, [data, open])

    useEffect(() => {

        if(portal){
            var payload = {
                PortalID: portal.ID
            }
    
            axiosWithCredentials.post('/procedure/getHomesServicesEmployees', payload)
            .then(res => {
                var homes = res.data.Homes.map(x => ({value: x.ID, label: x.Name}));
                var services = res.data.Services.map(x => ({ value: x.ID, label: x.Name}));
                var users = res.data.Users.map(x => ({ value: x.ID, label: x.FirstName + " " + x.LastName}));
    
                setOptions({
                    Homes: homes,
                    Services: services,
                    Users: users
                });
            
            })
            .catch(err => {
    
            })
        }
    }, [portal]);

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <ModalClose/>
            <DialogTitle>Edit Processing</DialogTitle>
            <DialogContent>Fill in the information of the processing.</DialogContent>
            <form
                className="max-w-[330px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid container spacing={2} sx={{marginBottom: 2}}>
                    <Grid item xs={12}>
                        <FormControl error={errors.Home} required>
                            <FormLabel>Home</FormLabel>
                            <Controller
                                name="Home"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select 
                                    sx={{
                                        marginBottom: "6px"
                                    }}
                                    required
                                    value={value ? value : ""} 
                                    onChange={(e, newValue) => {
                                        onChange(newValue);
                                    }} 
                                    id="select"
                                    >
                                            {options?.Homes.map(x => {
                                                return <Option value={x.value}>{x.label}</Option>
                                            })}
                                    </Select>
                                )}
                            />
                            <FormHelperText>
                                {errors.Home?.message}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl error={errors.Service} required>
                            <FormLabel>Service</FormLabel>
                            <Controller
                                name="Service"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select 
                                    sx={{
                                        marginBottom: "6px"
                                    }}
                                    required
                                    value={value ? value : ""} 
                                    onChange={(e, newValue) => {
                                        onChange(newValue);
                                    }} 
                                    id="select"
                                    >
                                            {options?.Services.map(x => {
                                                return <Option value={x.value}>{x.label}</Option>
                                            })}
                                    </Select>
                                )}
                            />
                            <FormHelperText>
                                {errors.Service?.message}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl required>
                            <FormLabel>Director</FormLabel>
                            <Controller
                                    name="User"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select 
                                        sx={{
                                            marginBottom: "6px"
                                        }}
                                        required
                                        value={value ? value : ""} 
                                        onChange={(e, newValue) => {
                                            onChange(newValue);
                                        }} 
                                        id="select"
                                        >
                                            {options?.Users.map(x => {
                                                return <Option value={x.value}>{x.label}</Option>
                                            })}
                                        </Select>
                                    )}
                                />
                                <FormHelperText>
                                    {errors.User?.message}
                                </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl error={errors.PreArranged}>
                            <FormLabel>Prearranged</FormLabel>
                            <Controller
                                    name="PreArranged"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Checkbox checked={value} onChange={onChange}/>
                                    )}
                                />
                                <FormHelperText>
                                    {errors.PreArranged?.message}
                                </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <FormControl>
                    <Button loading={submitLoading} type="submit">Submit</Button>
                </FormControl>
            </form>
            </ModalDialog>
        </Modal>
    )
}