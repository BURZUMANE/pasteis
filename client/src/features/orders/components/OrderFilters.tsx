import { Grid2 as Grid, TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface OrderFiltersProps {
    filters: {
        date: string;
        destination: string;
        status: string;
    };
    onFilterChange: (field: string, value: string) => void;
    onClearFilter: (field: string) => void;
}

const OrderFilters = ({ filters, onFilterChange, onClearFilter }: OrderFiltersProps) => {
    return (
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Grid size={4}>
                <TextField
                    label="Destination"
                    variant="outlined"
                    fullWidth
                    value={filters.destination}
                    onChange={(e) => onFilterChange('destination', e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: filters.destination && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => onClearFilter('destination')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    label="Date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                            endAdornment: filters.date && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => onClearFilter('date')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    value={filters.date}
                    onChange={(e) => onFilterChange('date', e.target.value)}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    label="Status"
                    variant="outlined"
                    fullWidth
                    select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="unassigned">Unassigned</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                </TextField>
            </Grid>
        </Grid>
    );
};

export default OrderFilters;
