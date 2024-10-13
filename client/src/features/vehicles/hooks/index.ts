import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiUtils } from '@/services/api';
import { API_ROUTES } from '@/services/apiRoutes';
import dayjs from 'dayjs';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Vehicle, VehicleFilters } from '@/common/types';
import { Order } from '@/common/types/order';


export const useCreateVehicleMutation = ({ onSuccess, onError }: { onSuccess: () => void, onError: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicleData: CreateVehicleDTO) => ApiUtils.post(API_ROUTES.VEHICLES, vehicleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            onSuccess()
        },
        onError
    });
};

export const useToggleFavouriteVehicleMutation = ({ onSuccess, onError }: { onSuccess: () => void, onError: () => void }) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    return useMutation({
        mutationFn: (vehicleId: number) => ApiUtils.post(`/vehicles/${vehicleId}/toggleFavourite`, { userId: user?.userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            onSuccess()
        },
        onError
    });
};


export const useFetchVehicles = (enabled: boolean, filters?: VehicleFilters) => {
    const { user } = useAuth()
    return useQuery<Vehicle[]>({
        queryKey: ['vehicles', filters],
        queryFn: () => ApiUtils.get<Vehicle[]>(`/vehicles`, {
            params: {
                vehiclePlate: filters?.vehiclePlate || undefined,
                scheduleDate: filters?.date || dayjs().format('YYYY-MM-DD'),
                userId: user?.userId ?? ''
            },
        }),
        enabled,
    });
};

export const useFetchRoute = (enabled: boolean, filters?: VehicleFilters) => {
    const { user } = useAuth();
    return useQuery<{ orders: Order[], googleMapsUrl: string }>({
        queryKey: ['vehicles', filters],
        queryFn: () => ApiUtils.get<{ orders: Order[], googleMapsUrl: string }>(`/route`, {
            params: {
                vehiclePlate: filters?.vehiclePlate ?? undefined,
                scheduleDate: filters?.date ?? dayjs().format('YYYY-MM-DD'),
                userId: user?.userId ?? undefined,
            },
        }),
        enabled: enabled && !!user?.userId,
    });
};
