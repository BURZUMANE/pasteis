import { useSocketContext } from '@/common/context/Socket';
import { Order } from '@/common/types/order';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMarkOrderAsDeliveredMutation } from '@/features/orders/hooks';
import { OrderStatus } from '@/features/orders/types';
import { useFetchRoute, useFetchVehicles } from '@/features/vehicles/hooks';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid2 as Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const DriverPage = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<{
        vehiclePlate?: string;
        date: string;
    }>({
        vehiclePlate: user?.vehiclePlate,
        date: dayjs().format('YYYY-MM-DD'),
    });

    const { data, refetch } = useFetchRoute(!!user?.userId, filters);
    const { data: vehicle, isLoading, isError } = useFetchVehicles(true, { vehiclePlate: user?.vehiclePlate });
    const orders = data?.orders || [];
    const googleMapsUrl = data?.googleMapsUrl;
    const { mutate } = useMarkOrderAsDeliveredMutation(refetch);

    const { socket } = useSocketContext();

    const handleMarkAsDelivered = (orderUUID: string) => {
        mutate(orderUUID);
    };

    useEffect(() => {
        if (!socket) return;

        const handleOrderAssigned = () => {
            refetch();
        };

        const handleOrderCompleted = () => {
            refetch();
        };

        socket.on('orderAssigned', handleOrderAssigned);
        socket.on('orderCompleted', handleOrderCompleted);

        return () => {
            socket.off('orderAssigned', handleOrderAssigned);
            socket.off('orderCompleted', handleOrderCompleted);
        };
    }, [socket, refetch]);

    const calculateAvailableCapacity = () => {
        if (!vehicle || !vehicle[0] || !data) return null;

        const totalOrderWeight = orders.reduce((acc, order) => {
            if (order.status !== 'delivered') {
                return acc + order.weight;
            }
            return acc;
        }, 0);

        return vehicle[0].maxCapacity - totalOrderWeight;
    };

    const availableCapacity = calculateAvailableCapacity();

    const renderOrder = (order: Order) => (
        <Grid size={12} key={order.id.toString()}>
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
            <Typography variant="body1" gutterBottom>
                Welcome, {user?.userNickname}, here are your scheduled orders for today.
            </Typography>

            {availableCapacity !== null && (
                <Typography variant="body1" gutterBottom>
                    Available capacity: {availableCapacity} kg
                </Typography>
            )}

            {googleMapsUrl && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body1">Here is your route on Google Maps:</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        href={googleMapsUrl}
                        target="_blank"
                        fullWidth
                    >
                        View Route
                    </Button>
                </Box>
            )}

            {orders.length > 0 ? (
                <Box>
                    <Typography variant="h5" gutterBottom>Today's Orders</Typography>
                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                        {orders.map(renderOrder)}
                    </Grid>
                </Box>
            ) : (
                <Typography variant="body1" color="textSecondary">No orders assigned for today.</Typography>
            )}
        </Box>
    );
};

export default DriverPage;
