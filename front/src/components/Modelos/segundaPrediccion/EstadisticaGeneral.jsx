import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Slide,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  alpha,
} from "@mui/material";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart,
  Info,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import MuiTooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";  // <== Solo esta línea, eliminando la duplicada abajo

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  '&.header': {
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    backdropFilter: 'blur(5px)'
  }
}));

const StyledPaper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[12],
}));

// Colores para gráficos pie
const colors = ["#00ffaa", "#ff00aa", "#00aaff", "#aa00ff"];

export default function EstadisticaGen({
  csvData = [],
  csvHeaders = [],
  perfiles = [],
}) {
  const refAnalisis = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const perfilesSeleccionados = perfiles;

  const getEstadisticasGenerales = () => {
    return [
      {
        icon: <PieChartIcon />,
        nombre: "Total Filas",
        valor: csvData.length,
      },
      {
        icon: <BarChartIcon />,
        nombre: "Total Columnas",
        valor: csvHeaders.length,
      },
      {
        icon: <Info />,
        nombre: "Perfiles Seleccionados",
        valor: perfilesSeleccionados.join(", ") || "-",
      },
    ];
  };

  const getDistribucionRespuestas = () => [
    { name: "A", cantidad: 30 },
    { name: "B", cantidad: 20 },
    { name: "C", cantidad: 10 },
    { name: "D", cantidad: 5 },
  ];

  const getDistribucionPorColumna = () => [
    { columna: "Col1", A: 10, B: 5, C: 3, D: 2 },
    { columna: "Col2", A: 8, B: 7, C: 2, D: 1 },
    { columna: "Col3", A: 6, B: 4, C: 4, D: 3 },
    { columna: "Col4", A: 7, B: 6, C: 5, D: 2 },
    { columna: "Col5", A: 9, B: 3, C: 2, D: 4 },
  ];
  return (
    <>
      <div ref={refAnalisis} />
      {csvData.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Chip
                label="2"
                color="secondary"
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
                Análisis de Datos Del CSV
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {getEstadisticasGenerales().map((stat, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <StyledPaper sx={{ p: 3, height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        color: "primary.main",
                      }}
                    >
                      {stat.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 1,
                          fontWeight: "bold",
                          color: "text.secondary",
                        }}
                      >
                        {stat.nombre}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        textAlign: "center",
                        textShadow: "0 0 10px rgba(0, 255, 170, 0.2)",
                      }}
                    >
                      {stat.valor}
                    </Typography>
                  </StyledPaper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PieChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      Distribución General de Respuestas
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getDistribucionRespuestas()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="cantidad"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getDistribucionRespuestas().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} respuestas`, "Cantidad"]}
                        contentStyle={{
                          background: "rgba(17, 34, 64, 0.9)",
                          border: "1px solid rgba(0, 255, 170, 0.3)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BarChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      Distribución por Columna (Top 5)
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getDistribucionPorColumna()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={alpha("#00ffaa", 0.1)}
                      />
                      <XAxis
                        dataKey="columna"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                        stroke="#00ffaa"
                      />
                      <YAxis stroke="#00ffaa" />
                      <Tooltip
                        formatter={(value) => [`${value} respuestas`, "Cantidad"]}
                        labelFormatter={(label) => `Columna: ${label}`}
                        contentStyle={{
                          background: "rgba(17, 34, 64, 0.9)",
                          border: "1px solid rgba(0, 255, 170, 0.3)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                        }}
                      />
                      <Bar
                        dataKey="A"
                        name="A"
                        stackId="a"
                        fill="#00ffaa"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="B"
                        name="B"
                        stackId="a"
                        fill="#ff00aa"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="C"
                        name="C"
                        stackId="a"
                        fill="#00aaff"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="D"
                        name="D"
                        stackId="a"
                        fill="#aa00ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
            </Grid>

            <StyledPaper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Info color="primary" sx={{ mr: 1 }} />
                Previsualización de Datos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Mostrando las primeras 5 filas del dataset cargado
              </Typography>

              <TableContainer
                sx={{
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  maxHeight: "400px",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "primary.main",
                    borderRadius: "4px",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {csvHeaders.slice(0, 10).map((header) => (
                        <StyledTableCell key={header} className="header">
                          <MuiTooltip title={header} placement="top">
                            <Typography variant="subtitle2">
                              {header.length > 15 ? header.substring(0, 15) + "..." : header}
                            </Typography>
                          </MuiTooltip>
                        </StyledTableCell>
                      ))}
                      {csvHeaders.length > 10 && (
                        <StyledTableCell className="header">
                          <Typography variant="subtitle2">...</Typography>
                        </StyledTableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csvData.slice(0, 5).map((row, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:nth-of-type(odd)": {
                            bgcolor: "background.default",
                          },
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        {csvHeaders.slice(0, 10).map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              bgcolor: selectedColumns.includes(header) ? alpha("#00ffaa", 0.1) : "transparent",
                            }}
                          >
                            <Typography variant="body2">{row[header] || "-"}</Typography>
                          </TableCell>
                        ))}
                        {csvHeaders.length > 10 && (
                          <TableCell>
                            <Typography variant="body2">...</Typography>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledPaper>
          </StyledPaper>
        </Slide>
      )}
    </>
  );
}
