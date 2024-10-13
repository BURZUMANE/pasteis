import { StyledTableCell, StyledTypography } from "./OrderList.styles";
import { OrderResponseItem } from "@/features/orders/types";
import { ArrowDownward, ArrowUpward, Event, Edit, Check, Place, Scale } from "@mui/icons-material";
import { Box, Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useState } from "react";

interface OrderListProps {
    orders: OrderResponseItem[];
    onAssignOrder: (orderUUID: string) => void;
    onSortChange: (column: string) => void;
    onUpdateObservations: (order: OrderResponseItem) => void;
    sort: string;
    order: "ASC" | "DESC";
}

const generateGoogleMapsLink = (lat: number, lon: number) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
};

export const OrderList = ({ orders, onAssignOrder, onSortChange, onUpdateObservations, sort, order }: OrderListProps) => {
    const [editingOrder, setEditingOrder] = useState<OrderResponseItem | null>();
    const [observations, setObservations] = useState<string>("");

    const getSortIcon = (column: string) => {
        if (sort === column) {
            return order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
        }
        return null;
    };

    const handleEditClick = (order: OrderResponseItem) => {
        setEditingOrder(order);
    };

    const handleSaveClick = () => {
        onUpdateObservations({ ...editingOrder, observations: observations } as any);
        setEditingOrder(null);
        setObservations('');
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell onClick={() => onSortChange("destination")}>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Dest Name {getSortIcon("destination")}
                            </StyledTypography>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => onSortChange("weight")}>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Weight (kg) {getSortIcon("weight")}
                            </StyledTypography>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => onSortChange("date")}>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Date {getSortIcon("date")}
                            </StyledTypography>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => onSortChange("observations")}>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Observations {getSortIcon("observations")}
                            </StyledTypography>
                        </StyledTableCell>
                        <TableCell>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Status
                            </StyledTypography>
                        </TableCell>
                        <TableCell>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Vehicle plate
                            </StyledTypography>
                        </TableCell>
                        <TableCell>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Dest Coordinates
                            </StyledTypography>
                        </TableCell>
                        <TableCell>
                            <StyledTypography variant="button" display="block" gutterBottom>
                                Actions
                            </StyledTypography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                {order.destination}
                            </TableCell>
                            <TableCell>
                                <Scale sx={{ verticalAlign: 'middle', mr: 1 }} />
                                {order.weight}
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Event sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    {new Date(order.date).toLocaleDateString()}
                                </Box>
                            </TableCell>
                            <TableCell>
                                {(editingOrder && editingOrder.id === order.id) ? (
                                    <TextField
                                        value={observations}
                                        onChange={(e) => setObservations(e.target.value)}
                                        size="small"
                                    />
                                ) : (
                                    order.observations || '-'
                                )}
                            </TableCell>
                            <TableCell>
                                {order.status}
                            </TableCell>
                            <TableCell>
                                {order.vehicleSchedule?.vehicle?.vehiclePlate || 'N/A'}
                            </TableCell>
                            <TableCell>
                                <Link href={generateGoogleMapsLink(order.lat, order.lon)} target="_blank" rel="noopener noreferrer">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                        <Place sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        {Number(order.lat).toFixed(3)}, {Number(order.lon).toFixed(3)}
                                    </Box>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                    {order.status === 'unassigned' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onAssignOrder(order.orderUUID)}
                                        >
                                            Assign
                                        </Button>
                                    )}
                                    {editingOrder && editingOrder.id === order.id ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSaveClick()}
                                        >
                                            <Check sx={{ verticalAlign: 'middle' }} />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleEditClick(order)}
                                        >
                                            <Edit sx={{ verticalAlign: 'middle' }} />

                                        </Button>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
