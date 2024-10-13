import { Box } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { styled } from '@mui/material/styles';

export const NavBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(4),
}));

export const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: 'none',
  marginRight: theme.spacing(3),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s ease',
  fontFamily: 'Roboto, sans-serif',

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
  },

  '&:last-child': {
    marginRight: 0,
  },
}));
