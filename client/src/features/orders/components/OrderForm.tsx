import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { OrderDTO } from '@/features/orders/types';
import dayjs, { Dayjs } from 'dayjs';

interface OrderFormProps {
    onSubmit: (order: OrderDTO) => void;
}

interface OrderFormState {
    weight: string;
    destination: string;
    latLon: string; 
    observations: string;
    status: string;
    date: string;
}

const OrderForm = ({ onSubmit }: OrderFormProps) => {
    const [orderData, setOrderData] = useState<OrderFormState>({
        weight: '',
        destination: '',
        latLon: '',
        observations: '',
        status: 'unassigned',
        date: dayjs().format('YYYY-MM-DD'),
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLatLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            latLon: value,
        }));
    };

    const handleDateChange = (date: Dayjs | null) => {
        setOrderData((prev) => ({
            ...prev,
            date: date ? date.format('YYYY-MM-DD') : '',
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const latLonArray = orderData.latLon.split(',').map(coord => coord.trim());
        if (latLonArray.length !== 2 || !latLonArray.every(coord => /^-?\d*(\.\d+)?$/.test(coord))) {
            alert('Please enter valid latitude and longitude.');
            return;
        }

        const [lat, lon] = latLonArray;

        const formOrder: OrderDTO = {
            weight: orderData.weight === '' ? 0 : Number(orderData.weight),
            destination: orderData.destination,
            lat: lat === '' ? 0 : Number(lat),
            lon: lon === '' ? 0 : Number(lon),
            observations: orderData.observations,
            status: orderData.status as 'unassigned' | 'assigned' | 'delivered',
            date: orderData.date,
        };
        onSubmit(formOrder);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
            <Typography variant="h6">Create a New Order</Typography>

            <TextField
                name="destination"
                label="Destination"
                fullWidth
                required
                onChange={handleChange}
                value={orderData.destination}
                sx={{ mt: 2 }}
            />

            <TextField
                name="weight"
                label="Weight (kg)"
                type="number"
                fullWidth
                required
                onChange={handleChange}
                value={orderData.weight}
                sx={{ mt: 2 }}
            />

            <TextField
                name="latLon"
                label="Latitude, Longitude"
                type="text"
                fullWidth
                required
                onChange={handleLatLonChange}
                value={orderData.latLon}
                sx={{ mt: 2 }}
                placeholder="e.g., 40.7128, -74.0060"
            />

            <TextField
                name="observations"
                label="Observations"
                fullWidth
                multiline
                rows={3}
                onChange={handleChange}
                value={orderData.observations}
                sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 2 }}>
                <DatePicker
                    label="Date"
                    value={dayjs(orderData.date)}
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                />
            </Box>

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                Submit
            </Button>
        </Box>
    );
};

export default OrderForm;
