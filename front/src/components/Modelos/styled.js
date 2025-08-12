import { styled, alpha } from "@mui/material/styles";
import { Paper, TableCell } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
  backdropFilter: 'blur(12px)',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.2),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 255, 170, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 255, 170, 0.25)',
    transform: 'translateY(-5px)'
  }
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  '&.header': {
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    backdropFilter: 'blur(5px)'
  }
}));