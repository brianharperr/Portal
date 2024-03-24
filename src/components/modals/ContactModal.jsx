import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, Input, Select, Option, FormControl, FormLabel, Button, FormHelperText, Grid, ModalClose } from "@mui/joy";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from "react";
import { axiosWithCredentials } from "../../configs/axios";
import PhoneNumberInput from "../PhoneNumberInput";

const relations = [
    { key: "", value: "", label: "" },
    { key: "Son", value: "Son", label: "Son" },
    { key: "Daughter", value: "Daughter", label: "Daughter" },
    { key: "Father", value: "Father", label: "Father" },
    { key: "Mother", value: "Mother", label: "Mother" },
    { key: "Grandfather", value: "Grandfather", label: "Grandfather" },
    { key: "Grandmother", value: "Grandmother", label: "Grandmother" },
    { key: "Aunt", value: "Aunt", label: "Aunt" },
    { key: "Uncle", value: "Uncle", label: "Uncle" },
    { key: "Cousin", value: "Cousin", label: "Cousin" },
    { key: "Friend", value: "Friend", label: "Friend" },
    { key: "Other", value: "Other", label: "Other" },
];

export default function ContactModal({ contact, open, onClose, onSuccess })
{
    const [submitLoading, setSubmitLoading] = useState(false);
    const schema = z.object({
        FirstName: z.string().max(45).nullable(),
        LastName: z.string().max(45).nullable(),
        Relation: z.string().max(45).nullable(),
        OtherRelation: z.string().max(45).nullable(),
        PhoneNumber: z.string().nullable(),
        Email: z.string().email().max(64).nullable(),
    });

    const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    
    const watchedRelation = watch('Relation');

    const onSubmit = (data) => {
        if(data.Relation === "Other"){
            data.Relation = data.OtherRelation;
        }
        delete data.OtherRelation;
        data.PhoneNumber = data.PhoneNumber.replace(/\D/g, "");
        setSubmitLoading(true);
        var payload = {
            ...data,
            ID: contact.ID
        }
        axiosWithCredentials.patch('/contact', payload)
        .then(res => {
            onSuccess(res.data);
        })
        .finally(() => setSubmitLoading(false))
    };

    useEffect(() => {
        if(contact){
            reset({
                FirstName: contact.FirstName,
                LastName: contact.LastName,
                Relation: contact.Relation,
                PhoneNumber: contact.PhoneNumber,
                Email: contact.Email,
                OtherRelation: null
            })
        }
    }, [contact, open])
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <ModalClose/>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogContent>Fill in the information of the contact.</DialogContent>
            <form
                className="max-w-[600px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid container spacing={2} flexDirection={'row'} sx={{ flexGrow: 1, marginBottom: 2 }}>
                    <Grid xs={6}>
                        <FormControl error={errors.FirstName}>
                            <FormLabel>First Name</FormLabel>
                            <Input {...register('FirstName')} 
                            autoFocus
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
                    <Grid xs={6}>
                        <FormControl>
                            <FormLabel>Last Name</FormLabel>
                            <Input 
                            {...register('LastName')}
                            slotProps={{
                                input: {
                                    maxLength: 45
                                }
                            }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={6}>
                        <FormControl>
                            <FormLabel>Relation</FormLabel>
                            <Controller
                                name="Relation"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select 
                                    sx={{
                                        marginBottom: "6px"
                                    }}
                                    value={value ? value : ""} 
                                    onChange={(e, newValue) => {
                                        onChange(newValue);
                                    }} 
                                    id="select"
                                    >
                                        {relations.map((x) => {
                                            return <Option value={x.value}>{x.label}</Option>;
                                        })}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={6}>
                        {watchedRelation === 'Other' &&
                        <FormControl>
                            <FormLabel>Custom Relation</FormLabel>
                            <Input 
                            placeholder="Enter relation"
                            {...register('OtherRelation')} 
                            slotProps={{
                                input: {
                                    maxLength: 45
                                }
                            }}
                            />
                        </FormControl>
                        }
                    </Grid>
                    <Grid xs={6}>
                        <FormControl error={errors.PhoneNumber}>
                            <FormLabel>Phone Number</FormLabel>
                            <Controller
                                name="PhoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <PhoneNumberInput value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={6}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input 
                            {...register('Email')} 
                            slotProps={{
                                input: {
                                    maxLength: 128
                                }
                            }}
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