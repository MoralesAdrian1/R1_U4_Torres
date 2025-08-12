import React, { useRef } from "react";
import {
  Box,
  Chip,
  Typography,
  Slide,
  Grid,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Radar as RadarIcon,
  Timeline,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";

const StyledPaper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[12],
}));

const colors = ["#00ffaa", "#ff00aa", "#00aaff", "#aa00ff"];

export default function EstadisticaRes({ resultados }) {
  const refResultados = useRef(null);

  // Aquí debes definir o recibir las funciones para obtener los datos, ej:
  const getDistribucionPerfiles = () => {
    // Ejemplo dummy, reemplaza con tus datos reales
    return resultados.distribucionPerfiles || [
      { perfil: "Perfil A", cantidad: 40 },
      { perfil: "Perfil B", cantidad: 30 },
      { perfil: "Perfil C", cantidad: 20 },
      { perfil: "Perfil D", cantidad: 10 },
    ];
  };

  const getDistribucionClusters = () => {
    return resultados.distribucionClusters || [
      { cluster: "Cluster 1", cantidad: 35 },
      { cluster: "Cluster 2", cantidad: 45 },
      { cluster: "Cluster 3", cantidad: 20 },
    ];
  };

  const getPromedioPuntajePorPerfil = () => {
    return resultados.promedioPuntajePorPerfil || [
      { perfil: "Perfil A", promedio: 75 },
      { perfil: "Perfil B", promedio: 82 },
      { perfil: "Perfil C", promedio: 65 },
      { perfil: "Perfil D", promedio: 90 },
    ];
  };

  const getEvolucionPuntaje = () => {
    return resultados.evolucionPuntaje || [
      { nombre: "Registro 1", puntaje: 70 },
      { nombre: "Registro 2", puntaje: 75 },
      { nombre: "Registro 3", puntaje: 80 },
      { nombre: "Registro 4", puntaje: 78 },
    ];
  };

  const getDistribucionPorNombre = () => {
    return resultados.distribucionPorNombre || [
      { nombre: "Nombre 1", cantidad: 20 },
      { nombre: "Nombre 2", cantidad: 35 },
      { nombre: "Nombre 3", cantidad: 25 },
      { nombre: "Nombre 4", cantidad: 30 },
    ];
  };

  return (
    <>
      <div ref={refResultados} />
      {resultados && resultados.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Chip
                label="4"
                color="warning"
                sx={{
                  mr: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  width: "32px",
                  height: "32px",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  flexGrow: 1,
                }}
              >
                Resultados del Modelo
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PieChartIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Distribución por Perfil Estimado
                    </Typography>
                  </Box>
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
                          <Cell
                            key={`cell-p-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} registros`, "Cantidad"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BarChartIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Distribución por Cluster
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getDistribucionClusters()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cluster" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} registros`, "Cantidad"]} />
                      <Legend />
                      <Bar dataKey="cantidad" name="Registros" fill="#00ffaa" />
                    </BarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <RadarIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Promedio Puntaje por Perfil
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={getPromedioPuntajePorPerfil()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="perfil" />
                      <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                      <Radar
                        name="Promedio"
                        dataKey="promedio"
                        stroke="#ff00aa"
                        fill="#ff00aa"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(2)} pts`, "Promedio"]}
                        contentStyle={{
                          background: "rgba(17, 34, 64, 0.9)",
                          border: "1px solid rgba(255, 0, 170, 0.3)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Timeline color="secondary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Evolución de Puntaje por Registro
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getEvolucionPuntaje()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} pts`, "Puntaje"]}
                        contentStyle={{
                          background: "rgba(17, 34, 64, 0.9)",
                          border: "1px solid rgba(0, 255, 170, 0.3)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="puntaje"
                        stroke="#00ffaa"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
            </Grid>

            <StyledPaper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
                Distribución por Nombre
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getDistribucionPorNombre()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} registros`, "Cantidad"]}
                    contentStyle={{
                      background: "rgba(17, 34, 64, 0.9)",
                      border: "1px solid rgba(0, 255, 170, 0.3)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cantidad" name="Registros" fill="#ff00aa" />
                </BarChart>
              </ResponsiveContainer>
            </StyledPaper>
          </StyledPaper>
        </Slide>
      )}
    </>
  );
}
