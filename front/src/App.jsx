import React, { useState, useEffect } from 'react';
import VisualizarModelo from './components/Modelos/VisualizarModelo';
import CrearModelo from './components/Modelos/CrearModelo2';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Button, Box, Container, Paper, Typography, Fade, Grow } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ParticlesBackground from './components/ParticlesBackground';

// Tema personalizado MUI mejorado
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffaa',
      contrastText: '#000',
    },
    secondary: {
      main: '#ff00aa',
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
    },
    text: {
      primary: '#ccd6f6',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
          padding: '14px 28px',
          fontSize: '1.1rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover': {
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: '0 8px 25px rgba(0, 255, 170, 0.4)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(-1px) scale(1.01)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.4s ease-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 40px rgba(0, 255, 170, 0.25)',
          },
        },
      },
    },
  },
});

function App() {
  const [vistaActual, setVistaActual] = useState('visualizar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a365d 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(0, 255, 170, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 0, 170, 0.15) 0%, transparent 50%),
              linear-gradient(45deg, rgba(0, 255, 170, 0.05) 0%, rgba(255, 0, 170, 0.05) 100%)
            `,
            zIndex: 0,
          },
        }}
      >
        {/* Efecto de partículas en el fondo */}
        <ParticlesBackground />
        
        {/* Efectos de luces neón mejorados */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(0, 255, 170, 0.1) 0deg, transparent 120deg, rgba(255, 0, 170, 0.1) 240deg, transparent 360deg)',
            animation: 'rotate 60s linear infinite',
            zIndex: 0,
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />

        {/* Container que ocupa toda la página */}
        <Container
          maxWidth={false} // Cambiado de "md" a false
          sx={{
            width: '100%',
            maxWidth: '100%',
            px: { xs: 2, sm: 4, md: 6, lg: 8 }, // Padding responsivo
            mt: { xs: 2, md: 4 },
            mb: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Grow in={!loading} timeout={800}>
            <Paper
              elevation={20}
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(17, 34, 64, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(0, 255, 170, 0.2)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #00ffaa 0%, #ff00aa 50%, #00ffaa 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                  },
                },
              }}
            >
              {/* Encabezado con efecto neón mejorado */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: 'center',
                  borderBottom: '1px solid rgba(0, 255, 170, 0.3)',
                  background: 'linear-gradient(135deg, rgba(0, 255, 170, 0.08) 0%, rgba(255, 0, 170, 0.08) 100%)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00ffaa, transparent)',
                    boxShadow: '0 0 20px rgba(0, 255, 170, 0.5)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00ffaa 0%, #00ccff 50%, #ff00aa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 4s ease-in-out infinite',
                    textShadow: '0 0 30px rgba(0, 255, 170, 0.4)',
                    mb: 3,
                    position: 'relative',
                    '@keyframes gradientShift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' },
                    },
                  }}
                >
                  Sistema de Clasificación KMeans
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    onClick={() => setVistaActual('visualizar')}
                    variant={vistaActual === 'visualizar' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<span style={{ fontSize: '1.2rem' }}>📊</span>}
                    sx={{
                      minWidth: '220px',
                      border: vistaActual !== 'visualizar' ? '2px solid rgba(0, 255, 170, 0.6)' : 'none',
                      background: vistaActual === 'visualizar' 
                        ? 'linear-gradient(135deg, #00ffaa 0%, #00cc88 100%)'
                        : 'transparent',
                      boxShadow: vistaActual === 'visualizar' 
                        ? '0 4px 20px rgba(0, 255, 170, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : 'none',
                    }}
                  >
                    Visualizar Modelos
                  </Button>
                  <Button
                    onClick={() => setVistaActual('crear')}
                    variant={vistaActual === 'crear' ? 'contained' : 'outlined'}
                    color="secondary"
                    startIcon={<span style={{ fontSize: '1.2rem' }}>🛠️</span>}
                    sx={{
                      minWidth: '220px',
                      border: vistaActual !== 'crear' ? '2px solid rgba(255, 0, 170, 0.6)' : 'none',
                      background: vistaActual === 'crear' 
                        ? 'linear-gradient(135deg, #ff00aa 0%, #cc0088 100%)'
                        : 'transparent',
                      boxShadow: vistaActual === 'crear' 
                        ? '0 4px 20px rgba(255, 0, 170, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : 'none',
                    }}
                  >
                    Crear Nuevo Modelo
                  </Button>
                </Box>
              </Box>

              {/* Contenido principal - Ahora ocupa toda la página */}
              <Box sx={{ p: { xs: 3, md: 4, lg: 6 } }}>
                <Fade in={!loading} timeout={1200}>
                  <Box
                    sx={{
                      minHeight: '60vh', // Asegurar altura mínima
                      width: '100%',
                    }}
                  >
                    {vistaActual === 'visualizar' ? <VisualizarModelo /> : <CrearModelo />}
                  </Box>
                </Fade>
              </Box>
            </Paper>
          </Grow>
        </Container>

        {/* Footer con efecto de brillo mejorado */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: 4,
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            borderTop: '1px solid rgba(0, 255, 170, 0.1)',
            background: 'rgba(10, 25, 47, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '1.1rem',
              cursor: 'default',
              position: 'relative',
              '&:hover': {
                color: 'primary.main',
                textShadow: '0 0 15px rgba(0, 255, 170, 0.6)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.4s ease',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%) scaleX(0)',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #00ffaa, #ff00aa)',
                transition: 'transform 0.4s ease',
              },
              '&:hover::after': {
                transform: 'translateX(-50%) scaleX(1)',
              },
            }}
          >
            Sistema de Clasificación KMeans - © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;