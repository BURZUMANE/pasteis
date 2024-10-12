import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useCreateVehicleMutation } from '@/features/vehicles/hooks';
import { CreateVehicle } from '@/core/types';

interface VehicleFormProps {
    onSubmit: (data: CreateVehicle) => void;
}

const VehicleForm = ({ onSubmit }: VehicleFormProps) => {
    const [vehicleData, setVehicleData] = useState({
        vehiclePlate: '',
        maxCapacity: '',
        availableCapacity: '',
    });

    const createVehicleMutation = useCreateVehicleMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVehicleData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = {
            ...vehicleData,
            maxCapacity: Number(vehicleData.maxCapacity),
            availableCapacity: Number(vehicleData.availableCapacity),
        };
        onSubmit(dataToSend);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6">Create a New Vehicle</Typography>
            <TextField
                name="vehiclePlate"
                label="Vehicle Plate"
                fullWidth
                required
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                name="maxCapacity"
                label="Max Capacity"
                fullWidth
                required
                type="number"
                value={vehicleData.maxCapacity}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                name="availableCapacity"
                label="Available Capacity"
                fullWidth
                required
                type="number"
                value={vehicleData.availableCapacity}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                Submit
            </Button>
        </Box>
    );
};

export default VehicleForm;
