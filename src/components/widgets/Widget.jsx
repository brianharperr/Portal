import { DragIndicator, Remove } from "@mui/icons-material";
import { Card, Box, Divider, Table, Sheet, IconButton, Tooltip } from "@mui/joy"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { axiosWithCredentials } from "../../configs/axios";
import { useDispatch } from "react-redux";
import BacklogWidget from "./BacklogWidget";

export default function Widget({ data, onDelete })
{

    function getTitle(){
        switch(data.Type){
            case 'Backlog':
                return 'My backlog';
        }
    }
    function getContent(){
        switch(data.Type){
            case 'Backlog':
                return <BacklogWidget/>;
        }
    }
    const title = getTitle();
    const content = getContent();
    return (
        <Card className="shadow-md h-full">
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            >
                {title}
                <div>
                <Tooltip color="danger" title="Remove">
                <IconButton onClick={() => onDelete(data.ID)} type="outlined">
                    <Remove/>
                </IconButton>
                </Tooltip>
                <Tooltip color='primary' title="Move">
                <IconButton className="drag-handle" type="outlined">
                    <DragIndicator/>
                </IconButton>
                </Tooltip>
                </div>
            </Box>
            <Divider/>
            {content}
        </Card>
    )
}