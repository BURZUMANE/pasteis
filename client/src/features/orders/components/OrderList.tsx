import { OrderResponseItem } from "@/features/orders/types";
import { ArrowDownward, ArrowUpward, Event, Info, LocalShipping, LocationOn, Place, Scale } from "@mui/icons-material";
import { Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface OrderListProps {
    orders: OrderResponseItem[];
    onAssignOrder: (orderUUID: string) => void;
    onSortChange: (column: string) => void;
    sort: string;
    order: "ASC" | "DESC";
}

export const OrderList = ({ orders, onAssignOrder, onSortChange, sort, order }: OrderListProps) => {
    const getSortIcon = (column: string) => {
        if (sort === column) {
            return order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
        }
        return null;
    };

    const generateGoogleMapsLink = (lat: number, lon: number) => {
        return `https://www.google.com/maps?q=${lat},${lon}`;
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell onClick={() => onSortChange("destination")}>
                            <Typography variant="button" display="block" gutterBottom>
                                <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Destination {getSortIcon("destination")}
                            </Typography>
                        </TableCell>
                        <TableCell onClick={() => onSortChange("weight")}>
                            <Typography variant="button" display="block" gutterBottom>
                                <Scale sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Weight (kg) {getSortIcon("weight")}
                            </Typography>
                        </TableCell>
                        <TableCell onClick={() => onSortChange("date")}>
                            <Typography variant="button" display="block" gutterBottom>
                                <Event sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Date {getSortIcon("date")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="button" display="block" gutterBottom>
                                <Info sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Status
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="button" display="block" gutterBottom>
                                <Info sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Vehicle plate
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="button" display="block" gutterBottom>
                                <Place sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Coordinates
                            </Typography>
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {order.destination}
                            </TableCell>
                            <TableCell>
                                <Scale sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {order.weight}
                            </TableCell>
                            <TableCell>
                                <Event sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {new Date(order.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Info sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {order.status}
                            </TableCell>
                            <TableCell>
                                <Info sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {order.vehiclePlate || 'N/A'}
                            </TableCell>
                            <TableCell>
                                <Link href={generateGoogleMapsLink(order.lat, order.lon)} target="_blank" rel="noopener noreferrer">
                                    <Place sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    {Number(order.lat).toFixed(3)}, {Number(order.lon).toFixed(3)}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {order.status === 'unassigned' && <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onAssignOrder(order.orderUUID)}
                                    startIcon={<LocalShipping />}
                                >
                                    Assign to Vehicle
                                </Button>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
