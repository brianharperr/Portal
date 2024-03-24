import { Avatar, Box, Button, Card, CardActions, CardContent, CardOverflow, Divider, FormControl, FormLabel, Input, MenuItem, Option, Radio, RadioGroup, Select, Stack, TabPanel, Textarea, Typography, useColorScheme, useTheme } from "@mui/joy"
import { useEffect, useState } from "react"
import { axiosWithCredentials } from "../../configs/axios";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getUsers } from "../../redux/features/user.slice";


export default function TaskPanel2({ task, id })
{
    const originalForm = {}; 
        task.TaskOptions.forEach(option => {
            originalForm[option.ID.toString()] = option.Value
    })
    const {mode, setMode} = useColorScheme();
    const [loading, setLoading] = useState(false);
    const [workerUser, setWorkerUser] = useState(null);

    const users = useSelector(getUsers);
    const theme = useTheme();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: originalForm
    })

    
    const formatDateTime = (datetimeString) => {
        const date = new Date(datetimeString);
        
        // Format date
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
    
        // Format time
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
        // Concatenate date and time
        const formattedDateTime = `${formattedDate}, ${formattedTime.toLowerCase()}`;
    
        return formattedDateTime;
    }

    const onCancel = () => {
        reset(originalForm);
    }

    const onSubmit = (data, e) => {
        e.preventDefault();

        const transformedArray = Object.entries(data).map(([key, value]) => ({
            id: parseInt(key),
            value: value
        }));
        var payload = {
            Options: transformedArray
        }
        setLoading(true);
        axiosWithCredentials.patch('/case/task/option', payload)
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        var payload = {};
        task.TaskOptions.forEach(option => {
            payload[option.ID.toString()] = option.Value
        })

        if(users){
            setWorkerUser(users?.find(x => x.ID === task.CompletedBy))
        }
        reset(payload)
    }, [task])

    return (
                <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} sx={{ 
                    flexGrow: 1, 
                    padding: 4, 
                    backgroundColor: theme.palette.background.backdrop,
                    borderRadius: 10,
                    marginBottom: 1
                    }}
                >
                    {task?.TaskOptions.map(option => {
                        return (
                            <FormControl>
                            <FormLabel>{option.Name}</FormLabel>

                            {option.Type === 'Employee' && 
                                <Controller
                                name={option.ID.toString()}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                    <Select 
                                    value={value ? parseInt(value) : ""} 
                                    onChange={(e, newValue) => {
                                        onChange(newValue);
                                    }} 
                                    id="select" 
                                    size="sm" 
                                    >
                                        {users?.map(x => {
                                            return <Option key={x.ID} value={x.ID}>{x.FirstName + " " + x.LastName}</Option>
                                        })
                                    }
                                    </Select>
                                    </>
                                )}
                                />
                            }
                            {option.Type === 'Date' && 
                                <Input {...register(option.ID.toString())} size='sm' type='date'/>
                            }
                            {option.Type === 'Radio Buttons' && 
                                <Controller
                                name={option.ID.toString()}
                                control={control}
                                render={({field}) => (
                                    <RadioGroup {...field} size="sm" orientation="horizontal">
                                    <Radio value="Y" label="Yes" variant="outlined"/>
                                    <Radio value="N" label="No" variant="outlined"/>
                                    </RadioGroup>
                                )}
                                />
                            }
                            {option.Type === 'Textarea' && 
                                <Textarea {...register(option.ID.toString())} size='sm' minRows={2} maxRows={12}/>
                            }
                            {option.Type === 'Text' && 
                                <Input/>
                            }
                            </FormControl>
                        )
                    })}
                    <CardOverflow sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ gap: 1, pt: 2 }}>
                        <Button size="sm" variant="outlined" color="neutral" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button loading={loading} size="sm" variant="solid" type='submit'>
                            Save
                        </Button>
                        </CardActions>
                    </CardOverflow>
                    {task.DateCompleted && 
                    <Card
                        variant="outlined"
                        sx={{
                            // to make the card resizable
                            overflow: 'auto',
                        }}
                        >
                        <Box
                            sx={{
                            display: 'flex',
                            alignItems: 'center',
                            }}
                        >
                            <Avatar src={workerUser?.Pic} size="lg" />
                            <Stack orientation='vertical' sx={{ marginLeft: 2}}>
                                <Typography level="body-sm">Completed by</Typography>
                                <Typography level="title-sm">
                                {workerUser?.FirstName + " " + workerUser?.LastName}
                                </Typography>
                            </Stack>
                        </Box>
                        <CardContent>
                            <Typography level="body-sm">
                            {formatDateTime(task.DateCompleted)}
                            </Typography>
                        </CardContent>
                    </Card>
                    }
                </Stack>
                </form>
    )
}