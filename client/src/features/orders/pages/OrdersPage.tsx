import React, { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { CreateOrderButton } from '@/features/orders/components/CreateOrderButton';
import OrderFilters from '@/features/orders/components/OrderFilters';
import { OrderList } from '@/features/orders/components/OrderList';
import AssignOrderModal from '@/features/orders/components/AssignOrderModal';
import { useAssignOrderMutation, useCreateOrderMutation, useFetchOrders } from '@/features/orders/hooks';
import { OrderDTO, OrderResponseItem } from '@/features/orders/types';
import useToast from '@/core/hooks/useToast';
import { useSocketContext } from '@/core/context/Socket';
import { useAuth } from '@/features/auth/context/AuthContext';

const OrdersPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { mutate } = useAssignOrderMutation();

    const [filters, setFilters] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        destination: '',
        status: 'unassigned',
        sort: 'date',
        order: 'ASC' as 'ASC' | 'DESC',
    });

    const { data: fetchedOrders, isLoading, isError } = useFetchOrders(filters);
    const [orders, setOrders] = useState<OrderResponseItem[]>([]);
    const { socket } = useSocketContext();

    useEffect(() => {
        if (fetchedOrders) {
            setOrders(fetchedOrders);
        }
    }, [fetchedOrders]);

    useEffect(() => {
        if (socket) {
            const handleOrderCompleted = (data: { orderUUID: string }) => {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderUUID === data.orderUUID
                            ? { ...order, status: 'delivered' }
                            : order
                    )
                );
            };

            socket.on('orderCompleted', handleOrderCompleted);

            return () => {
                socket.off('orderCompleted', handleOrderCompleted);
            };
        }
    }, [socket]);

    const { mutate: createOrder } = useCreateOrderMutation();

    const handleCreateOrder = useCallback(
        (orderData: OrderDTO) => {
            createOrder(orderData, {
                onSuccess: () => showToast('Order created successfully!', 'success'),
                onError: () => showToast('Failed to create order', 'error'),
            });
        },
        [createOrder, showToast]
    );

    const handleAssignOrder = useCallback(
        (orderUUID: string) => {
            setSelectedOrderId(orderUUID);
            setAssignModalOpen(true);
        },
        []
    );

    const handleFilterChange = useCallback(
        (field: string, value: string) => {
            setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
        },
        []
    );

    const handleClearFilter = useCallback(
        (field: string) => {
            setFilters((prevFilters) => ({ ...prevFilters, [field]: '' }));
        },
        []
    );

    const handleSortChange = useCallback(
        (column: string) => {
            setFilters((prevFilters) => ({
                ...prevFilters,
                sort: column,
                order: prevFilters.order === 'ASC' ? 'DESC' : 'ASC',
            }));
        },
        []
    );

    return (
        <>
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h4">Orders</Typography>
                    <CreateOrderButton onSubmit={handleCreateOrder} />
                </Box>

                <OrderFilters filters={filters} onFilterChange={handleFilterChange} onClearFilter={handleClearFilter} />

                {isLoading && <CircularProgress />}
                {isError && <Typography color="error">Failed to load orders.</Typography>}
                <OrderList
                    orders={orders || []}
                    onAssignOrder={handleAssignOrder}
                    onSortChange={handleSortChange}
                    sort={filters.sort}
                    order={filters.order}
                />
            </Box>

            <AssignOrderModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                orderUUID={selectedOrderId}
                onAssign={(orderUUID: string, vehiclePlate: string) => {
                    mutate({ vehiclePlate, orderUUID, userId: user!.userId });
                    setAssignModalOpen(false);
                }}
            />
        </>
    );
};

export default OrdersPage;
