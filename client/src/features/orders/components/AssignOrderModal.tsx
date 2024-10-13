import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useFetchVehicles } from '@/features/vehicles/hooks';
import Modal from '@/common/components/Modal/Modal';

interface AssignOrderModalProps {
    open: boolean;
    onClose: () => void;
    orderUUID: string | null;
    onAssign: (orderUUID: string, vehiclePlate: string) => void;
}

const AssignOrderModal = ({ open, onClose, orderUUID, onAssign }: AssignOrderModalProps) => {
    const [selectedVehicle, setSelectedVehicle] = useState<string | ''>('');

    const { data: vehiclesData } = useFetchVehicles(open)
    const handleAssign = () => {
        if (orderUUID && selectedVehicle) {
            onAssign(orderUUID, selectedVehicle);
        }
    };

    const vehicles = vehiclesData || [];


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ backgroundColor: 'white' }}>
                <Typography variant="h6">Assign Order to Vehicle</Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Vehicle</InputLabel>
                    <Select
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        label="Vehicle"
                    >
                        {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.vehiclePlate} value={vehicle.vehiclePlate}>
                                {vehicle.vehiclePlate} {vehicle.isFavorite ? '⭐' : ''}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleAssign}>
                    Assign
                </Button>
            </Box>
        </Modal>
    );
};

export default AssignOrderModal;
