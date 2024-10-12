import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid2 as Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
} from '@mui/material';
import dayjs from 'dayjs';
import { useFetchVehicles } from '@/features/vehicles/hooks';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMarkOrderAsDeliveredMutation } from '@/features/orders/hooks';
import { UserRole } from '@/core/types';
import { useSocketContext } from '@/core/context/Socket';

interface Order {
    id: string;
    orderUUID: string;
    destination: string;
    weight: number;
    observations?: string;
    status: string;
}

interface Schedule {
    loadedCapacity: number;
    orders: Order[];
}

interface Vehicle {
    vehiclePlate: string;
    maxCapacity: number;
    schedules: Schedule[];
}

const DriverPage = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<{
        vehiclePlate?: string;
        date: string;
    }>({
        vehiclePlate: user?.vehiclePlate,
        date: dayjs().format('YYYY-MM-DD'),
    });

    const { data: vehicles, refetch } = useFetchVehicles(user?.role === UserRole.Driver, filters);
    const vehicle = vehicles?.[0] as Vehicle | undefined;
    const { mutate } = useMarkOrderAsDeliveredMutation(refetch);

    const { socket } = useSocketContext();

    const handleMarkAsDelivered = (orderUUID: string) => {
        mutate(orderUUID);
    };


    useEffect(() => {
        if (!socket) return;

        const handleOrderAssigned = (data: { orderUUID: string }) => {
            refetch();
        };

        const handleOrderCompleted = (data: { orderUUID: string }) => {
            refetch();
        };

        socket.on('orderAssigned', handleOrderAssigned);
        socket.on('orderCompleted', handleOrderCompleted);

        return () => {
            socket.off('orderAssigned', handleOrderAssigned);
            socket.off('orderCompleted', handleOrderCompleted);
        };
    }, [socket, refetch]);

    const renderVehicleDetails = () => (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Vehicle Details</Typography>
                <Typography variant="body1"><strong>Vehicle Plate:</strong> {vehicle?.vehiclePlate}</Typography>
                <Typography variant="body1"><strong>Max Capacity:</strong> {vehicle?.maxCapacity} kg</Typography>
                <Typography variant="body1">
                    <strong>Available Capacity:</strong> {vehicle ? vehicle.maxCapacity - (vehicle.schedules?.[0]?.loadedCapacity ?? 0) : 'N/A'} kg
                </Typography>
            </CardContent>
        </Card>
    );

    const renderOrder = (order: Order) => (
        <Grid size={12} key={order.id}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>Order ID: {order.orderUUID}</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Destination" secondary={order.destination} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Weight" secondary={`${order.weight} kg`} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Observations" secondary={order.observations || 'None'} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Status" secondary={order.status} />
                        </ListItem>
                    </List>
                    <Divider sx={{ mt: 2 }} />
                    {order.status !== "delivered" && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleMarkAsDelivered(order.orderUUID)}
                                fullWidth
                            >
                                Delivered
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>Driver Dashboard</Typography>
            <Typography variant="body1" gutterBottom>Welcome, here are your scheduled orders for today.</Typography>

            {vehicle ? renderVehicleDetails() : (
                <Typography variant="body1" color="error">No vehicle assigned or no data available.</Typography>
            )}

            {vehicle?.schedules && vehicle.schedules.length > 0 && vehicle.schedules[0]?.orders?.length > 0 ? (
                <Box>
                    <Typography variant="h5" gutterBottom>Today's Orders</Typography>
                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                        {vehicle.schedules[0].orders.map(renderOrder)}
                    </Grid>
                </Box>
            ) : (
                <Typography variant="body1" color="textSecondary">No orders assigned for today.</Typography>
            )}

        </Box>
    );
};

export default DriverPage;
