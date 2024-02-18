import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createWidget, deleteWidget, fetchWidgets, getWidgets } from "../../redux/features/widget.slice";
import { Dropdown, Grid, Menu, MenuButton, MenuItem, Snackbar } from "@mui/joy";
import { Add } from '@mui/icons-material';
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import { Responsive, WidthProvider } from "react-grid-layout";
import Widget from "./Widget";
import { axiosWithCredentials } from "../../configs/axios";

export default function Widgets()
{
    const dispatch = useDispatch();
    const widgets = useSelector(getWidgets);
    const [layout, setLayout] = useState([])
    const [addWidgetLoading, setAddWidgetLoading] = useState(false);

    const ResponsiveGridLayout = WidthProvider(Responsive);
    const handleDeleteWidget = (id) => {
        dispatch(deleteWidget(id));
    }

    const handleAddWidget = (type) => {
        
        setAddWidgetLoading(true);
        var payload = {
          Type: type,
          x: 0,
          y: 0,
          w: 8,
          h: 8
        }
        dispatch(createWidget(payload)).unwrap()
        .finally(() => setAddWidgetLoading(false));
    }

    const updateWidgetLayout = (newLayout) => {
        const delayDebounceFn = setTimeout(() => {
            if(newLayout.length > 0){
                axiosWithCredentials.patch('/widget/layout', { widgets: newLayout })
            }
          }, 2000)

        return () => clearTimeout(delayDebounceFn)
    }

    useEffect(() => {
        if(widgets){
            var format = widgets.map(widget => ({
                i: widget.ID.toString(),
                x: widget.x,
                y: widget.y,
                minW: 2,
                minH: 4,
                w: widget.w,
                h: widget.h
            }))

            setLayout({ lg: format });
        }else{
            dispatch(fetchWidgets());
        }
    }, [widgets])
    
    return (
        <>
            {/* <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={layoutLoadingStatus}
            variant='plain'
            size='sm'
            >{layoutLoadingStatus}</Snackbar> */}
            <Dropdown>
                <MenuButton loading={addWidgetLoading} sx={{ width: 200}} color='primary'>
                <Add/>
                Add Widget
                </MenuButton>
                <Menu size='sm' placement='bottom-start'>
                    <MenuItem onClick={() => handleAddWidget("Spotlight")}>Spotlight</MenuItem>
                    <MenuItem onClick={() => handleAddWidget("Backlog")}>Backlog</MenuItem>
                </Menu>
            </Dropdown>
          <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 16, md: 16, sm: 4, xs: 1, xxs: 1 }}
                rowHeight={40}
                draggableHandle=".drag-handle"


                layouts={layout}
                onDragStop={(layout) => updateWidgetLayout(layout)}
                onResizeStop={(layout) => updateWidgetLayout(layout)}
            >
                {widgets?.map(x => {
                    return (
                        <div key={x.ID.toString()} xs={12} sm={12} md={6}>
                            <Widget onDelete={(id) => handleDeleteWidget(id)} data={x}/>
                        </div>
                    )
                })}
            </ResponsiveGridLayout>
            </>
    )
}