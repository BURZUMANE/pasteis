import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiUtils } from '@/services/api';
import { OrderResponseItem, OrderDTO } from '@/features/orders/types';
import { API_ROUTES } from '@/services/apiRoutes';
import { extractErrorMessage } from '@/utils/errorUtils';
import { AxiosError } from 'axios';
import useToast from '@/common/hooks/useToast';

export const useFetchOrders = (filters: { date?: string, destination?: string, sort?: string, order?: 'ASC' | 'DESC', status?: string }) => {
    return useQuery<OrderResponseItem[]>({
        queryKey: ['orders', filters],
        queryFn: () => ApiUtils.get<OrderResponseItem[]>(API_ROUTES.ORDERS, {
            params: filters,
        }),
    });
};

export const useCreateOrderMutation = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (order: OrderDTO) => ApiUtils.post<OrderDTO>(API_ROUTES.ORDERS, order),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            showToast('Order created successfully', 'success');
        },
        onError: (e: AxiosError) => {
            const errorMessage = extractErrorMessage(e);
            showToast(errorMessage, 'error');
        },
    });
};

interface AssignOrderDTO {
    orderUUID: string;
    vehiclePlate: string;
    userId: number;
}

export const useAssignOrderMutation = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (assignOrderData: AssignOrderDTO) => ApiUtils.post(API_ROUTES.ORDERS_ASSIGN, assignOrderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            showToast('Order assigned successfully', 'success');
        },
        onError: (e: AxiosError) => {
            const errorMessage = extractErrorMessage(e);
            showToast(errorMessage, 'error');
        },
    });
};

export const useMarkOrderAsDeliveredMutation = (refetch: () => void) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (orderUUID: string) => {
            return ApiUtils.post(`${API_ROUTES.COMPLETE_ORDER}/${orderUUID}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            showToast('Order marked as delivered successfully', 'success');
            refetch();
        },
        onError: () => {
            showToast('Failed to mark order as delivered', 'error');
        },
    });
};


export const useUpdateOrderMutation = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (updatedOrder: OrderResponseItem) => ApiUtils.put(API_ROUTES.ORDERS, updatedOrder),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            showToast('Order updated successfully', 'success');
        },
        onError: (e: AxiosError) => {
            const errorMessage = extractErrorMessage(e);
            showToast(errorMessage, 'error');
        },
    });
};