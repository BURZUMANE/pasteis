import styled from "@emotion/styled";
import { TableCell, Typography } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    cursor: 'pointer',
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    
}));
