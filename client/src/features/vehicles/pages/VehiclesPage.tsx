import Modal from '@/common/components/Modal/Modal';
import useToast from '@/common/hooks/useToast';
import { CreateVehicle } from '@/common/types';
import VehicleFilters from '@/features/vehicles/components/VehicleFilters';
import { useCreateVehicleMutation, useFetchVehicles, useToggleFavouriteVehicleMutation } from '@/features/vehicles/hooks';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, Button, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import VehicleForm from '../components/VehicleForm';

const VehiclesPage = () => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    vehiclePlate: '',
  });

  const { data: vehicles, isLoading, isError } = useFetchVehicles(true, filters);

  const handleClose = () => setOpen(false);

  const { mutate: toggleFavouriteMutation } = useToggleFavouriteVehicleMutation({ onSuccess: () => { showToast('Favorite toggled successfully', 'success') }, onError: () => { showToast('Failed to toggle favorite', 'error') } });

  const handleCreateVehicle = (data: CreateVehicle) => {
    createVehicle(data);
    handleClose();
  };

  const { mutate: createVehicle } = useCreateVehicleMutation({
    onSuccess: handleClose, onError: () => {
      showToast('Failed to create vehicle', 'error');
    }
  })

  const handleToggleFavourite = (vehicleId: number) => {
    toggleFavouriteMutation(vehicleId);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilter = (field: string) => {
    setFilters((prev) => ({ ...prev, [field]: '' }));
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Vehicles</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mt: 2, mb: 2 }}>
          Add Vehicle
        </Button>
      </Box>

      <VehicleFilters filters={filters} onFilterChange={handleFilterChange} onClearFilter={handleClearFilter} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Plate</TableCell>
              <TableCell>Available Capacity</TableCell>
              <TableCell>Assigned Orders</TableCell>
              <TableCell>Favourite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="error">Failed to load vehicles</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehicles?.map((vehicle) => {
                const schedule = vehicle.schedules?.[0];
                return (
                  <TableRow key={vehicle.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{vehicle.vehiclePlate}</TableCell>
                    <TableCell>{vehicle.availableCapacity} kg</TableCell>
                    <TableCell>
                      {schedule ? (
                        <Box>
                          {schedule.orders && schedule.orders.length > 0 ? (
                            <ul>
                              {schedule.orders.map((order) => (
                                <li key={order.id}>
                                  {order.destination} ({order.weight} kg) - {order.status}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No orders assigned'
                          )}
                        </Box>
                      ) : (
                        'No schedules'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleToggleFavourite(vehicle.id)}>
                        {vehicle.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 2,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Vehicle</Typography>
          <VehicleForm onSubmit={handleCreateVehicle} />
        </Box>
      </Modal>
    </Box>
  );
};

export default VehiclesPage;
