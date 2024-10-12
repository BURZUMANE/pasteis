import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiUtils } from '@/services/api';
import { API_ROUTES } from '@/services/apiRoutes';
import dayjs from 'dayjs';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Vehicle, VehicleFilters } from '@/core/types';


export const useCreateVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicleData: any) => ApiUtils.post(API_ROUTES.VEHICLES, vehicleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        },
    });
};

export const useToggleFavouriteVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicleId: number) => ApiUtils.post(`/vehicles/${vehicleId}/toggleFavourite`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        },
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