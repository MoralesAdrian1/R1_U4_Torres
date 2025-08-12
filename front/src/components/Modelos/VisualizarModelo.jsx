import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Fade,
  Grow,
  Slide,
  Zoom
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";
import { generarPDF } from "../../utils/pdfUtils";

// Animación de brillo neón
const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ffaa, 0 0 20px #00ffaa;
  }
  50% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff00aa, 0 0 15px #ff00aa, 0 0 20px #ff00aa;
  }
`;

const colors = [
  '#00ffaa', '#ff00aa', '#00aaff', '#aa00ff', '#ffaa00',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'
];

// Estilo personalizado para el Paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(17, 34, 64, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 170, 0.2)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 255, 170, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 255, 170, 0.3)',
    transform: 'translateY(-5px)'
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.header': {
    backgroundColor: theme.palette.background.paper,
    fontWeight: 'bold',
    color: theme.palette.primary.main
  }
}));

export default function VisualizarModelo() {
  const [modelosGuardados, setModelosGuardados] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Referencia al contenedor del reporte para PDF
  const reporteRef = useRef();

  // Resumen de la técnica de Everett Rogers y los 4 tipos de consumidores
  const resumenEverettRogers = `
Everett Rogers propuso la teoría de la difusión de innovaciones, que explica cómo las nuevas ideas y tecnologías se adoptan en una sociedad.
Según Rogers, los consumidores se pueden clasificar en cuatro tipos principales:
1. Innovadores: Primeros en adoptar nuevas ideas, buscan novedad y están dispuestos a asumir riesgos.
2. Adoptadores tempranos: Líderes de opinión, influyen en otros y adoptan rápidamente las innovaciones.
3. Mayoría temprana y tardía: Adoptan la innovación después de ver resultados en otros, son más cautelosos.
4. Rezagados: Últimos en adoptar, suelen ser escépticos y resistentes al cambio.
`;

  // Objetivo de KMeans
  const objetivoKMeans = `
El objetivo de KMeans es agrupar registros en clusters según similitud de sus respuestas, permitiendo identificar patrones y segmentos de consumidores para facilitar la toma de decisiones estratégicas.
`;

  useEffect(() => {
    const cargarModelos = async () => {
      try {
        setCargando(true);
        const res = await fetch("http://localhost:8000/modelos_guardados/");
        if (!res.ok) {
          throw new Error('Error al cargar modelos');
        }
        const data = await res.json();
        setModelosGuardados(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarModelos();
  }, []);

  const cargarModelo = async (nombre) => {
    if (!nombre) {
      setModeloSeleccionado(null);
      return;
    }
    try {
      setCargando(true);
      const res = await fetch(`http://localhost:8000/modelos_guardados/${nombre}`);
      if (!res.ok) {
        throw new Error('No se pudo cargar el modelo');
      }
      const data = await res.json();
      setModeloSeleccionado(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // FUNCIONES DE GRAFICAS
  // =========================

  // Pie: Distribución por perfil estimado
  const getDistribucionPerfiles = () => {
    if (!modeloSeleccionado?.resultados) return [];
    const dist = {};
    modeloSeleccionado.resultados.forEach(r => {
      dist[r.perfil_estimado] = (dist[r.perfil_estimado] || 0) + 1;
    });
    return Object.entries(dist).map(([perfil, cantidad]) => ({
      perfil,
      cantidad
    }));
  };

  // Bar: Distribución por cluster
  const getDistribucionClusters = () => {
    if (!modeloSeleccionado?.resultados) return [];
    const dist = {};
    modeloSeleccionado.resultados.forEach(r => {
      dist[r.cluster] = (dist[r.cluster] || 0) + 1;
    });
    return Object.entries(dist).map(([cluster, cantidad]) => ({
      cluster,
      cantidad
    }));
  };

  // Radar: Promedio puntaje por perfil
  const getPromedioPuntajePorPerfil = () => {
    if (!modeloSeleccionado?.resultados) return [];
    const sum = {};
    const count = {};
    modeloSeleccionado.resultados.forEach(r => {
      if (!sum[r.perfil_estimado]) {
        sum[r.perfil_estimado] = 0;
        count[r.perfil_estimado] = 0;
      }
      sum[r.perfil_estimado] += Number(r.puntaje_perfil) || 0;
      count[r.perfil_estimado]++;
    });
    return Object.keys(sum).map(perfil => ({
      perfil,
      promedio: count[perfil] ? (sum[perfil] / count[perfil]) : 0
    }));
  };

  // Line: Evolución puntaje por registro
  const getEvolucionPuntaje = () => {
    if (!modeloSeleccionado?.resultados) return [];
    return modeloSeleccionado.resultados.map((r, idx) => ({
      nombre: r.nombre || `Reg${idx + 1}`,
      puntaje: Number(r.puntaje_perfil) || 0
    }));
  };

  // Area: Distribución por nombre
  const getDistribucionPorNombre = () => {
    if (!modeloSeleccionado?.resultados) return [];
    const dist = {};
    modeloSeleccionado.resultados.forEach(r => {
      dist[r.nombre] = (dist[r.nombre] || 0) + 1;
    });
    return Object.entries(dist).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  };

  if (cargando && modelosGuardados.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        flexDirection="column"
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            mb: 3,
            '& circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            animation: `${neonGlow} 2s infinite alternate`
          }}
        >
          Cargando modelos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(198, 40, 40, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(198, 40, 40, 0.3)',
            boxShadow: '0 4px 20px rgba(198, 40, 40, 0.1)',
            '& .MuiAlert-icon': {
              color: 'error.main',
              fontSize: '2rem'
            }
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'error.dark',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Reintentar
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>Error</AlertTitle>
          {error}
        </Alert>
      </Zoom>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grow in={true}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 4,
            pb: 2,
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(to right, #00ffaa, #ff00aa) 1',
            color: 'text.primary',
            textAlign: 'center',
            textShadow: '0 0 5px rgba(0, 255, 170, 0.3)'
          }}
        >
          Visualizar Modelo Guardado
        </Typography>
      </Grow>

      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.secondary',
              mb: 1
            }}
          >
            Selecciona un modelo guardado:
          </Typography>

          <Select
            onChange={(e) => cargarModelo(e.target.value)}
            value={modeloSeleccionado?.nombre_modelo || ""}
            fullWidth
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '8px',
              '& .MuiSelect-select': {
                py: 1.5,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'secondary.main',
                boxShadow: '0 0 10px rgba(255, 0, 170, 0.3)'
              }
            }}
          >
            <MenuItem value="">
              <em>-- Seleccione un modelo --</em>
            </MenuItem>
            {modelosGuardados.map((m) => (
              <MenuItem
                key={m.nombre_modelo}
                value={m.nombre_modelo}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 170, 0.1)'
                  }
                }}
              >
                {m.nombre_modelo} (Clusters: {m.n_clusters}, Perfiles: {m.perfiles.join(", ")})
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Slide>

      {cargando && modeloSeleccionado && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress
            size={50}
            thickness={3}
            sx={{
              color: 'secondary.main',
              mr: 2
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              animation: `${neonGlow} 2s infinite alternate`
            }}
          >
            Cargando modelo...
          </Typography>
        </Box>
      )}

      {modeloSeleccionado && !cargando && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                if (reporteRef.current) {
                  await generarPDF(reporteRef.current, modeloSeleccionado?.nombre_modelo || "Reporte Modelo");
                }
              }}
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                px: 3,
                py: 1.5,
                boxShadow: "0 2px 8px rgba(255,0,170,0.15)",
                animation: `${neonGlow} 2s infinite alternate`
              }}
            >
              Descargar PDF del Reporte
            </Button>
          </Box>
          <Fade in={true} timeout={500}>
            <div ref={reporteRef} id="reporte-modelo">
              <StyledPaper elevation={12} sx={{ p: 3, mt: 3 }}>
                {/* NUEVO: Fecha y objetivo */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Fecha del reporte: {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                  Objetivo del modelo KMeans
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                  {objetivoKMeans}
                </Typography>
                {/* NUEVO: Resumen Everett Rogers */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                  Resumen de la técnica de Everett Rogers y tipos de consumidores
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                  {resumenEverettRogers}
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: 'primary.main',
                    mb: 3,
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    fontWeight: 'bold',
                    textShadow: '0 0 5px rgba(0, 255, 170, 0.2)'
                  }}
                >
                  Datos del modelo: {modeloSeleccionado.nombre_modelo}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ p: 2, height: '100%' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'text.secondary',
                          mb: 1
                        }}
                      >
                        Número de clusters
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          textAlign: 'center'
                        }}
                      >
                        {modeloSeleccionado.n_clusters}
                      </Typography>
                    </StyledPaper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ p: 2, height: '100%' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'text.secondary',
                          mb: 1
                        }}
                      >
                        Perfiles
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          textAlign: 'center'
                        }}
                      >
                        {modeloSeleccionado.perfiles.join(", ")}
                      </Typography>
                    </StyledPaper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ p: 2, height: '100%' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'text.secondary',
                          mb: 1
                        }}
                      >
                        Cluster Perfiles
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          textAlign: 'center'
                        }}
                      >
                        {modeloSeleccionado.cluster_perfiles.join(", ")}
                      </Typography>
                    </StyledPaper>
                  </Grid>
                </Grid>

                {/* GRAFICAS */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* 1. Pie: Distribución por perfil estimado */}
                  <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                        Distribución por Perfil Estimado
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={getDistribucionPerfiles()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="cantidad"
                            label={({ perfil, cantidad }) => `${perfil}: ${cantidad}`}
                          >
                            {getDistribucionPerfiles().map((entry, index) => (
                              <Cell key={`cell-p-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </StyledPaper>
                  </Grid>

                  {/* 2. Bar: Distribución por cluster */}
                  <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                        Distribución por Cluster
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getDistribucionClusters()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="cluster" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                          <Legend />
                          <Bar dataKey="cantidad" name="Registros" fill="#00ffaa" />
                        </BarChart>
                      </ResponsiveContainer>
                    </StyledPaper>
                  </Grid>

                  {/* 3. Radar: Promedio puntaje por perfil */}
                  <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                        Promedio Puntaje por Perfil
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={getPromedioPuntajePorPerfil()}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="perfil" />
                          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                          <Radar name="Promedio" dataKey="promedio" stroke="#ff00aa" fill="#ff00aa" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </StyledPaper>
                  </Grid>

                  {/* 4. Line: Evolución puntaje por registro */}
                  <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                        Evolución Puntaje por Registro
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={getEvolucionPuntaje()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="puntaje" stroke="#00aaff" strokeWidth={2} dot />
                        </LineChart>
                      </ResponsiveContainer>
                    </StyledPaper>
                  </Grid>

                  {/* 5. Area: Distribución por nombre */}
                  <Grid item xs={12} md={12}>
                    <StyledPaper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                        Distribución de Registros por Nombre
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={getDistribucionPorNombre()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="cantidad" stroke="#ffaa00" fill="#ffaa00" fillOpacity={0.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </StyledPaper>
                  </Grid>
                </Grid>

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: 'secondary.main',
                    mb: 3,
                    fontWeight: 'bold'
                  }}
                >
                  Resultados de Clasificación
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'background.paper' }}>
                        <StyledTableCell className="header">Nombre</StyledTableCell>
                        <StyledTableCell className="header">Cluster</StyledTableCell>
                        <StyledTableCell className="header">Perfil Estimado</StyledTableCell>
                        <StyledTableCell className="header">Puntaje Perfil</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modeloSeleccionado.resultados.map((r, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            '&:nth-of-type(odd)': {
                              bgcolor: 'rgba(0, 255, 170, 0.05)'
                            },
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 170, 0.1)'
                            }
                          }}
                        >
                          <StyledTableCell>{r.nombre || "-"}</StyledTableCell>
                          <StyledTableCell>{r.cluster}</StyledTableCell>
                          <StyledTableCell>{r.perfil_estimado}</StyledTableCell>
                          <StyledTableCell>{r.puntaje_perfil || "-"}</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledPaper>
            </div>
          </Fade>
        </>
      )}

      {!modeloSeleccionado && !cargando && modelosGuardados.length > 0 && (
        <Zoom in={true}>
          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: '12px',
              bgcolor: 'rgba(0, 170, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 170, 255, 0.3)',
              '& .MuiAlert-icon': {
                color: 'info.main',
                fontSize: '2rem'
              }
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>Instrucción</AlertTitle>
            Selecciona un modelo de la lista para visualizar sus detalles
          </Alert>
        </Zoom>
      )}

      {!cargando && modelosGuardados.length === 0 && (
        <Zoom in={true}>
          <Alert
            severity="warning"
            sx={{
              mt: 3,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 167, 38, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 167, 38, 0.3)',
              '& .MuiAlert-icon': {
                color: 'warning.main',
                fontSize: '2rem'
              }
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>Aviso</AlertTitle>
            No hay modelos guardados disponibles
          </Alert>
        </Zoom>
      )}
    </Box>
  );
}