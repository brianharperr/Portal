import { InfoOutlined } from "@mui/icons-material";
import { ListItem, ListItemContent, Skeleton, Tooltip, Typography } from "@mui/joy";

export default function GenericListItem({ loading, title, value, date, tooltip, tooltipText, phoneNumber })
{
    function formatPhoneNumber(str){
        if(str){
            return `(${str.substring(0, 3)}) ${str.substring(3, 6)}-${str.substring(6)}`;
        }
        return "";
    }

    function formatDateTime(datetimeString) {
        if(datetimeString){
        const date = new Date(datetimeString);
        
        // Get the month abbreviation
        const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    
        // Get the day and year
        const day = date.getDate();
        const year = date.getFullYear();
    
        // Construct the formatted string
        const formattedDateTime = `${monthAbbreviation} ${day}, ${year}`;
    
        return formattedDateTime;
        }
        return ""
    }

    function renderValue(value){

        if(date){
            return formatDateTime(value);
        }

        if(phoneNumber){
            return formatPhoneNumber(value);
        }

        return value;
    }

    return (
        <>
        {loading ?
                <ListItem>
                    <ListItemContent>
                    <Typography level="title-sm">{title}</Typography>
                    <Typography>
                        <Skeleton animation="wave" width="100px" variant="text" level="body-sm"/>
                    </Typography>
                    </ListItemContent>
                </ListItem>
        :
            <>
            {(value !== null && value !== "") &&
                <ListItem>
                    <ListItemContent>
                    <Typography level="title-sm">{title}</Typography>
                    <Typography 
                    endDecorator={tooltip && <Tooltip size="sm" title={tooltipText}><InfoOutlined/></Tooltip>}
                    level="body-sm">
                        {renderValue(value)}
                    </Typography>
                    </ListItemContent>
                </ListItem>
            }
            </>
        }

        </>
    )
}