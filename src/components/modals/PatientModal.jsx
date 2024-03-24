import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, Input, Select, Option, FormControl, FormLabel, Button, FormHelperText, Grid, ModalClose } from "@mui/joy";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from "react";
import { axiosWithCredentials } from "../../configs/axios";

export default function PatientModal({ patient, open, onClose, onSuccess })
{
    const [submitLoading, setSubmitLoading] = useState(false);
    const schema = z.object({
        FirstName: z.string().max(45),
        MiddleName: z.string().max(45).nullable(),
        LastName: z.string().max(45),
        Sex: z.enum(['M', 'F']),
        Age: z.number().int().min(0).nullable(),
        Residence: z.string().max(126).nullable(),
        CauseOfDeath: z.string().max(64).nullable(),
        DateOfDeath: z.string().nullable(),
    });

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    
    const onSubmit = (data) => {
        setSubmitLoading(true);
        var payload = {
            ...data,
            ID: patient.ID
        }
        axiosWithCredentials.patch('/patient', payload)
        .then(res => {
            onSuccess(res.data);
        })
        .finally(() => setSubmitLoading(false))
    };

    useEffect(() => {
        if(patient){
            reset({
                FirstName: patient.FirstName,
                MiddleName: patient.MiddleName,
                LastName: patient.LastName,
                Sex: patient.Sex,
                Age: patient.Age,
                Residence: patient.Residence,
                CauseOfDeath: patient.CauseOfDeath,
                DateOfDeath: new Date(patient.DateOfDeath).toISOString().split('T')[0],
            })
        }
    }, [patient, open])
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <ModalClose/>
            <DialogTitle>Edit Deceased</DialogTitle>
            <DialogContent>Fill in the information of the deceased.</DialogContent>
            <form
                className="max-w-[600px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid container spacing={2} sx={{marginBottom: 2}}>
                        <Grid container sm={12} md={6} direction={'column'}>
                            <Grid item xs={12}>
                                <FormControl error={errors.FirstName} required>
                                    <FormLabel>First Name</FormLabel>
                                    <Input {...register('FirstName')} 
                                    autoFocus 
                                    required 
                                    slotProps={{
                                        input: {
                                            maxLength: 45
                                        }
                                    }}
                                    />
                                    <FormHelperText>
                                        {errors.FirstName?.message}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel>Middle Name</FormLabel>
                                    <Input 
                                    {...register('MiddleName')} 
                                    slotProps={{
                                        input: {
                                            maxLength: 45
                                        }
                                    }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl required>
                                <FormLabel>Last Name</FormLabel>
                                <Input 
                                {...register('LastName')} 
                                required 
                                slotProps={{
                                    input: {
                                        maxLength: 45
                                    }
                                }}
                                />
                            </FormControl>
                        </Grid>
                        </Grid>
                        <Grid container sm={12} md={6} direction={'column'}>
                            <Grid item xs={12}>
                                <FormControl required>
                                    <FormLabel>Sex</FormLabel>
                                    <Controller
                                        name="Sex"
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
                                                <Option value="M">Male</Option>
                                                <Option value="F">Female</Option>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl error={errors.Age}>
                                    <FormLabel>Age</FormLabel>
                                    <Input {...register('Age', { setValueAs: (v  => v === "" ? null : parseInt(v, 10) )})} type='number' />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl>
                                <FormLabel>Residence</FormLabel>
                                <Input 
                                {...register('Residence')} 
                                slotProps={{
                                    input: {
                                        maxLength: 128
                                    }
                                }}
                                />
                            </FormControl>
                        </Grid>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl>
                                <FormLabel>Cause of Death</FormLabel>
                                <Input 
                                {...register('CauseOfDeath')} 
                                slotProps={{
                                    input: {
                                        maxLength: 64
                                    }
                                }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <FormControl>
                                <FormLabel>Date of Death</FormLabel>
                                <Controller
                                control={control}
                                name="DateOfDeath"
                                render={({ field }) => (
                                    <>
                                    <Input value={field.value} onChange={field.onChange} type='date' />
                                    </>
                                )}
                                />
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