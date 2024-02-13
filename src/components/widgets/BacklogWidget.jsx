import { Card, Box, Divider, Table, Sheet } from "@mui/joy"
import { useEffect, useState } from "react"
import { axiosWithCredentials } from "../../configs/axios"
import { useNavigate } from "react-router-dom";
import WidgetContainer from "./Widget";

export default function BacklogWidget({ id })
{
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axiosWithCredentials.get('/case/my-orders')
        .then(res => setOrders(res.data))
    }, []);

    return (
        <Sheet 
        sx={{
            '--TableCell-height': '40px',
            // the number is the amount of the header rows.
            '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
            height: 'inherit',
            overflow: 'auto',
            background: (theme) =>
            `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
                farthest-side at 50% 0,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
            ),
            radial-gradie45gnt( 
                farthest-side at 50% 100%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
                )
                0 100%`,
            backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'local, local, scroll, scroll',
            backgroundPosition:
            '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
            backgroundColor: 'background.surface',
        }}
        >
        <Table hoverRow stickyHeader className="!overflow-auto">
            <thead>
                <tr>
                    <th className="!w-[80px]">Order</th>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Home</th>
                </tr>
            </thead>
            <tbody>
                {orders?.map(order => {
                    return (
                        <tr className="hover:cursor-pointer" onClick={() => navigate('/order/' + order.DisplayID)}>
                            <td>{order.DisplayID}</td>
                            <td>{order.Patient.FirstName + ' ' + order.Patient.LastName}</td>
                            <td>{order.Service.Name}</td>
                            <td>{order.Home.Name}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        </Sheet>
    )
}