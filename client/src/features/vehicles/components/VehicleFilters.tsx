import { Grid2 as Grid, TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface VehicleFiltersProps {
    filters: {
        vehiclePlate: string;
        date: string;
    };
    onFilterChange: (field: string, value: string) => void;
    onClearFilter: (field: string) => void;
}

const VehicleFilters = ({ filters, onFilterChange, onClearFilter }: VehicleFiltersProps) => {
    return (
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Grid>
                <TextField
                    label="Vehicle Plate"
                    variant="outlined"
                    fullWidth
                    value={filters.vehiclePlate}
                    onChange={(e) => onFilterChange('vehiclePlate', e.target.value)}
                    InputProps={{
                        endAdornment: filters.vehiclePlate && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => onClearFilter('vehiclePlate')} edge="end">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid>
                <TextField
                    label="Date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        endAdornment: filters.date && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => onClearFilter('date')} edge="end">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={filters.date}
                    onChange={(e) => onFilterChange('date', e.target.value)}
                />
            </Grid>
        </Grid>
    );
};

export default VehicleFilters;
