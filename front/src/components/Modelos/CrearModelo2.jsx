import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Alert,
  AlertTitle,
  Fade,
  Grow,
  Slide,
  Zoom,
  Chip,
  Tooltip as MuiTooltip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  CloudUpload,
  Save,
  PlayArrow,
  Info,
  CheckCircle,
  DataUsage,
  TableChart,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart,
  Radar as RadarIcon,
  Timeline,
  ArrowUpward,
  ArrowDownward,
  ListAlt,
  Assignment,
  Assessment,
  DoneAll,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// =================== ESTILOS ===================
const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ffaa, 0 0 20px #00ffaa;
  }
  50% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff00aa, 0 0 15px #ff00aa, 0 0 20px #ff00aa;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 170, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 170, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 170, 0);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.3)}`
  }
}));

const colors = [
  '#00ffaa', '#ff00aa', '#00aaff', '#aa00ff', '#ffaa00',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'
];

// ========== PREGUNTAS POR PERFIL ==========
const preguntasPorPerfil = {
  conservador: [
    { id: 1, texto: "¿Esperas antes de probar productos nuevos?", columna: "AdopcionProductoNuevo" },
    { id: 2, texto: "¿Valoras marcas reconocidas?", columna: "FactorMarcaImportante" },
    { id: 3, texto: "¿Lees reseñas antes de comprar?", columna: "AntesCompraImportante" },
    { id: 4, texto: "¿Dedicas tiempo a investigar antes de comprar?", columna: "TiempoInvestigacionCompra" },
    { id: 5, texto: "¿Prefieres restaurantes conocidos?", columna: "ProbarRestauranteNuevo" },
    { id: 6, texto: "¿Eres escéptico ante ofertas por tiempo limitado?", columna: "ReaccionOfertasTiempoLimitado" },
    { id: 7, texto: "¿Te influyen opiniones de personas de confianza?", columna: "InfluenciaOpinionesOtros" },
    { id: 8, texto: "¿Prefieres testimonios de usuarios en redes sociales?", columna: "ContenidoRedesSociales" },
    { id: 9, texto: "¿Buscas seguridad y funcionalidad al comprar?", columna: "MotivacionCompra" },
    { id: 10, texto: "¿Consideras una compra buena si cumple expectativas?", columna: "CuandoBuenaCompra" },
    { id: 11, texto: "¿Te quedas tranquilo si el producto cumple?", columna: "PostCompraConducta" },
    { id: 12, texto: "¿Eres leal a tus marcas favoritas?", columna: "FrecuenciaCambioMarca" },
    { id: 13, texto: "¿Prefieres destinos de vacaciones conocidos?", columna: "EleccionVacaciones" },
    { id: 14, texto: "¿Ignoras productos nuevos en el supermercado?", columna: "ProductoNuevoSupermercado" },
    { id: 15, texto: "¿Prefieres estilos clásicos y atemporales?", columna: "RelacionTendenciaModa" }
  ],
  innovador: [
    { id: 1, texto: "¿Pruebas productos nuevos apenas salen?", columna: "AdopcionProductoNuevo" },
    { id: 2, texto: "¿Buscas características innovadoras en marcas?", columna: "FactorMarcaImportante" },
    { id: 3, texto: "¿Buscas lo más avanzado antes de comprar?", columna: "AntesCompraImportante" },
    { id: 4, texto: "¿Te interesa investigar nuevas funcionalidades?", columna: "TiempoInvestigacionCompra" },
    { id: 5, texto: "¿Prefieres restaurantes únicos y nuevos?", columna: "ProbarRestauranteNuevo" },
    { id: 6, texto: "¿Aprovechas ofertas por tiempo limitado?", columna: "ReaccionOfertasTiempoLimitado" },
    { id: 7, texto: "¿Formas tu propia opinión sin influencia social?", columna: "InfluenciaOpinionesOtros" },
    { id: 8, texto: "¿Prefieres demostraciones innovadoras en redes?", columna: "ContenidoRedesSociales" },
    { id: 9, texto: "¿Buscas lo más avanzado al comprar?", columna: "MotivacionCompra" },
    { id: 10, texto: "¿Descubres nuevas necesidades al comprar?", columna: "CuandoBuenaCompra" },
    { id: 11, texto: "¿Exploras todas las funcionalidades después de comprar?", columna: "PostCompraConducta" },
    { id: 12, texto: "¿Te gusta probar marcas nuevas?", columna: "FrecuenciaCambioMarca" },
    { id: 13, texto: "¿Prefieres destinos poco explorados?", columna: "EleccionVacaciones" },
    { id: 14, texto: "¿Pruebas productos nuevos en el supermercado?", columna: "ProductoNuevoSupermercado" },
    { id: 15, texto: "¿Te gusta estar al día con lo último en moda?", columna: "RelacionTendenciaModa" }
  ],
  pragmatico: [
    { id: 1, texto: "¿Analizas la relación calidad-precio?", columna: "AdopcionProductoNuevo" },
    { id: 2, texto: "¿Buscas la mejor relación calidad-precio en marcas?", columna: "FactorMarcaImportante" },
    { id: 3, texto: "¿Haces comparativas antes de comprar?", columna: "AntesCompraImportante" },
    { id: 4, texto: "¿Evalúas datos y comparativas al investigar?", columna: "TiempoInvestigacionCompra" },
    { id: 5, texto: "¿Revisas menú y precios antes de ir a un restaurante?", columna: "ProbarRestauranteNuevo" },
    { id: 6, texto: "¿Calculas si una oferta es realmente buena?", columna: "ReaccionOfertasTiempoLimitado" },
    { id: 7, texto: "¿Consideras información objetiva en opiniones?", columna: "InfluenciaOpinionesOtros" },
    { id: 8, texto: "¿Prefieres comparativas técnicas en redes sociales?", columna: "ContenidoRedesSociales" },
    { id: 9, texto: "¿Buscas funcionalidad y eficiencia al comprar?", columna: "MotivacionCompra" },
    { id: 10, texto: "¿Obtienes el máximo valor por tu dinero?", columna: "CuandoBuenaCompra" },
    { id: 11, texto: "¿Evalúas si cumplió expectativas después de comprar?", columna: "PostCompraConducta" },
    { id: 12, texto: "¿Cambias de marca si encuentras algo mejor?", columna: "FrecuenciaCambioMarca" },
    { id: 13, texto: "¿Buscas la mejor relación calidad-precio en vacaciones?", columna: "EleccionVacaciones" },
    { id: 14, texto: "¿Comparas ingredientes y valor nutricional?", columna: "ProductoNuevoSupermercado" },
    { id: 15, texto: "¿Compras lo que es práctico y se ve bien?", columna: "RelacionTendenciaModa" }
  ],
  emocional: [
    { id: 1, texto: "¿Te emociona probar productos nuevos?", columna: "AdopcionProductoNuevo" },
    { id: 2, texto: "¿Te gusta que una marca refleje tu personalidad?", columna: "FactorMarcaImportante" },
    { id: 3, texto: "¿Te conectas emocionalmente antes de comprar?", columna: "AntesCompraImportante" },
    { id: 4, texto: "¿Te dejas llevar por inspiración al investigar?", columna: "TiempoInvestigacionCompra" },
    { id: 5, texto: "¿Te atrae lo visual y especial en restaurantes?", columna: "ProbarRestauranteNuevo" },
    { id: 6, texto: "¿Te llama la atención visualmente una oferta?", columna: "ReaccionOfertasTiempoLimitado" },
    { id: 7, texto: "¿Te influyen experiencias emocionales de otros?", columna: "InfluenciaOpinionesOtros" },
    { id: 8, texto: "¿Prefieres historias emotivas en redes sociales?", columna: "ContenidoRedesSociales" },
    { id: 9, texto: "¿Buscas autorrealización y estima al comprar?", columna: "MotivacionCompra" },
    { id: 10, texto: "¿Te sientes feliz y satisfecho con la compra?", columna: "CuandoBuenaCompra" },
    { id: 11, texto: "¿Te hace sentir bien compartir en redes después de comprar?", columna: "PostCompraConducta" },
    { id: 12, texto: "¿Cambias de marca por conexión emocional?", columna: "FrecuenciaCambioMarca" },
    { id: 13, texto: "¿Eliges lugares que te inspiran en vacaciones?", columna: "EleccionVacaciones" },
    { id: 14, texto: "¿Te dejas llevar por el empaque y lo especial?", columna: "ProductoNuevoSupermercado" },
    { id: 15, texto: "¿Buscas autenticidad y expresión en moda?", columna: "RelacionTendenciaModa" }
  ]
};

// ========== COLUMNAS VIRTUALES SIMILARES ==========
const columnasVirtuales = [
  "SatisfaccionGeneral",
  "PreferenciaCanalCompra",
  "FrecuenciaUsoProducto",
  "NivelRecomendacion",
  "ImpactoPublicidad",
  "TiempoEntrega",
  "FacilidadDevolucion"
];

export default function CrearModelo2() {
  // Refs para cada sección
  const refInicio = useRef(null);
  const refCarga = useRef(null);
  const refConfig = useRef(null);
  const refAnalisis = useRef(null);
  const refColumnas = useRef(null);
  const refResultados = useRef(null);
  const refFinal = useRef(null);

  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [nClusters, setNClusters] = useState(2);
  const [perfiles, setPerfiles] = useState({
    conservador: false,
    innovador: false,
    pragmatico: false,
    emocional: false,
  });
  const [nombreModelo, setNombreModelo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Para el menú lateral
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columnasEsperadas = [
    "AdopcionProductoNuevo","FactorMarcaImportante","AntesCompraImportante","TiempoInvestigacionCompra",
    "ProbarRestauranteNuevo","ReaccionOfertasTiempoLimitado","InfluenciaOpinionesOtros","ContenidoRedesSociales",
    "MotivacionCompra","CuandoBuenaCompra","PostCompraConducta","FrecuenciaCambioMarca",
    "EleccionVacaciones","ProductoNuevoSupermercado","RelacionTendenciaModa"
  ];

  const perfilesSeleccionados = Object.entries(perfiles)
    .filter(([_, checked]) => checked)
    .map(([perfil]) => perfil);

  // Función para obtener columnas recomendadas según perfiles seleccionados
  const getColumnasRecomendadas = useMemo(() => {
    if (perfilesSeleccionados.length === 0) return [];
    const columnasRecomendadas = new Set();
    perfilesSeleccionados.forEach(perfil => {
      preguntasPorPerfil[perfil].forEach(pregunta => {
        columnasRecomendadas.add(pregunta.columna);
      });
    });
    return Array.from(columnasRecomendadas);
  }, [perfilesSeleccionados]);

  // Efecto para auto-seleccionar columnas cuando cambian los perfiles
  React.useEffect(() => {
    if (perfilesSeleccionados.length > 0 && csvHeaders.length > 0) {
      const columnasRecomendadas = getColumnasRecomendadas;
      const columnasDisponibles = csvHeaders.filter(h => columnasRecomendadas.includes(h));
      // Solo actualiza si es diferente
      if (
        selectedColumns.length === 0 ||
        columnasDisponibles.some(col => !selectedColumns.includes(col))
      ) {
        setSelectedColumns(columnasDisponibles);
      }
    }
  }, [perfilesSeleccionados, csvHeaders, getColumnasRecomendadas]);

  const preguntasFiltradas = useMemo(() => {
    if (perfilesSeleccionados.length === 0) return [];
    const preguntas = [];
    const columnasIncluidas = new Set();
    perfilesSeleccionados.forEach(perfil => {
      preguntasPorPerfil[perfil].forEach(pregunta => {
        if (!columnasIncluidas.has(pregunta.columna)) {
          preguntas.push(pregunta);
          columnasIncluidas.add(pregunta.columna);
        }
      });
    });
    return preguntas;
  }, [perfilesSeleccionados]);

  const procesarCSV = (text) => {
    try {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setCsvHeaders(headers);
      setCsvData(rows);

      const columnasDisponibles = headers.filter(h => columnasEsperadas.includes(h));
      setSelectedColumns(columnasDisponibles);
      setError(null);
    } catch (err) {
      setError("Error al procesar el archivo CSV. Asegúrate de que tenga el formato correcto.");
      console.error("Error procesando CSV:", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError("Por favor, sube un archivo con extensión .csv");
      return;
    }

    try {
      setProcesando(true);
      const text = await file.text();
      setCsvFile(file);
      procesarCSV(text);
    } catch (err) {
      setError("Error al leer el archivo. Intenta con otro archivo.");
      console.error("Error leyendo archivo:", err);
    } finally {
      setProcesando(false);
    }
  };

  const handleColumnSelection = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const getDistribucionRespuestas = () => {
    if (!csvData.length || !selectedColumns.length) return [];

    const distribucion = { A: 0, B: 0, C: 0, D: 0 };

    csvData.forEach(row => {
      selectedColumns.forEach(col => {
        const value = row[col]?.toUpperCase();
        if (distribucion.hasOwnProperty(value)) {
          distribucion[value]++;
        }
      });
    });

    return Object.entries(distribucion).map(([respuesta, cantidad]) => ({
      name: respuesta,
      cantidad
    }));
  };

  const getEstadisticasGenerales = () => {
    return [
      { nombre: 'Total Registros', valor: csvData.length, icon: <DataUsage /> },
      { nombre: 'Columnas Totales', valor: csvHeaders.length + columnasVirtuales.length, icon: <TableChart /> },
      { nombre: 'Columnas Seleccionadas', valor: selectedColumns.length, icon: <CheckCircle /> },
      { nombre: 'Registros con Nombre', valor: csvData.filter(row => row.nombre).length, icon: <Info /> }
    ];
  };

  const getDistribucionPorColumna = () => {
    if (!selectedColumns.length) return [];

    // Solo columnas reales para la gráfica
    return selectedColumns.filter(col => !columnasVirtuales.includes(col)).slice(0, 5).map(column => {
      const distribucion = { A: 0, B: 0, C: 0, D: 0 };
      csvData.forEach(row => {
        const value = row[column]?.toUpperCase();
        if (distribucion.hasOwnProperty(value)) {
          distribucion[value]++;
        }
      });

      return {
        columna: column.length > 20 ? column.substring(0, 20) + '...' : column,
        A: distribucion.A,
        B: distribucion.B,
        C: distribucion.C,
        D: distribucion.D
      };
    });
  };

  const getDistribucionPerfiles = () => {
    if (!resultados.length) return [];
    const dist = {};
    resultados.forEach(r => {
      dist[r.perfil_estimado] = (dist[r.perfil_estimado] || 0) + 1;
    });
    return Object.entries(dist).map(([perfil, cantidad]) => ({
      perfil,
      cantidad
    }));
  };

  const getDistribucionClusters = () => {
    if (!resultados.length) return [];
    const dist = {};
    resultados.forEach(r => {
      dist[r.cluster] = (dist[r.cluster] || 0) + 1;
    });
    return Object.entries(dist).map(([cluster, cantidad]) => ({
      cluster,
      cantidad
    }));
  };

  const getPromedioPuntajePorPerfil = () => {
    if (!resultados.length) return [];
    const sum = {};
    const count = {};
    resultados.forEach(r => {
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

  const getEvolucionPuntaje = () => {
    if (!resultados.length) return [];
    return resultados.map((r, idx) => ({
      nombre: r.nombre || `Reg${idx + 1}`,
      puntaje: Number(r.puntaje_perfil) || 0
    }));
  };

  const getDistribucionPorNombre = () => {
    if (!resultados.length) return [];
    const dist = {};
    resultados.forEach(r => {
      dist[r.nombre] = (dist[r.nombre] || 0) + 1;
    });
    return Object.entries(dist).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  };

  const handlePredict = async () => {
    if (!csvFile) {
      setError("Debes cargar un archivo CSV primero");
      return;
    }
    if (perfilesSeleccionados.length < 2) {
      setError("Selecciona al menos 2 perfiles");
      return;
    }
    if (nClusters !== perfilesSeleccionados.length) {
      setError("El número de clusters debe ser igual al número de perfiles seleccionados");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("n_clusters", nClusters);
    formData.append("perfiles", perfilesSeleccionados.join(","));

    try {
      setProcesando(true);
      setError(null);
      const res = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResultados(data.resultados);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
      console.error("Error en predicción:", err);
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardarModelo = async () => {
    if (!csvFile) {
      setError("Debes cargar un archivo CSV primero");
      return;
    }
    if (!nombreModelo.trim()) {
      setError("Escribe un nombre para el modelo");
      return;
    }
    if (perfilesSeleccionados.length < 2) {
      setError("Selecciona al menos 2 perfiles");
      return;
    }
    if (nClusters !== perfilesSeleccionados.length) {
      setError("El número de clusters debe ser igual al número de perfiles seleccionados");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("nombre_modelo", nombreModelo);
    formData.append("n_clusters", nClusters);
    formData.append("perfiles", perfilesSeleccionados.join(","));

    try {
      setProcesando(true);
      setError(null);
      const res = await fetch("http://localhost:8000/guardar_modelo/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      alert(data.message || "Modelo guardado exitosamente");
      setNombreModelo("");
      setResultados([]);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
      console.error("Error guardando modelo:", err);
    } finally {
      setProcesando(false);
    }
  };

  // Unir columnas reales y virtuales para la selección
  const todasLasColumnas = [
    ...csvHeaders.filter(header => header !== 'nombre'),
    ...columnasVirtuales
  ];

  // Función para scroll suave
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setDrawerOpen(false); // Cierra el menú si se navega
    }
  };

  // Índice de accesibilidad
  const indiceSecciones = [
    { label: "Inicio", icon: <ArrowUpward />, ref: refInicio },
    { label: "Carga de Datos", icon: <Assignment />, ref: refCarga },
    { label: "Configurar Modelo", icon: <ListAlt />, ref: refConfig },
    { label: "Análisis de Datos", icon: <Assessment />, ref: refAnalisis },
    { label: "Seleccionar Columnas", icon: <TableChart />, ref: refColumnas },
    { label: "Resultados", icon: <DoneAll />, ref: refResultados },
    { label: "Final", icon: <ArrowDownward />, ref: refFinal }
  ];

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Menú hamburguesa flotante */}
      <IconButton
        aria-label="Abrir menú de navegación"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 1200,
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': { bgcolor: 'secondary.main' }
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Drawer lateral */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            bgcolor: 'background.paper',
            borderRight: '2px solid',
            borderColor: 'primary.main',
            pt: 1
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', flexGrow: 1 }}>
            Navegación
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          {indiceSecciones.map(({ label, icon, ref }) => (
            <ListItem
              button
              key={label}
              onClick={() => scrollToRef(ref)}
              sx={{
                borderRadius: '10px',
                mb: 1,
                '&:hover': { bgcolor: alpha('#00ffaa', 0.07) }
              }}
              aria-label={`Ir a ${label}`}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.main' }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Índice de accesibilidad visible arriba */}
      <Box ref={refInicio} sx={{
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: '12px',
        p: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {indiceSecciones.map(({ label, icon, ref }) => (
          <Button
            key={label}
            variant="outlined"
            color="primary"
            startIcon={icon}
            onClick={() => scrollToRef(ref)}
            sx={{
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1,
              boxShadow: 'none'
            }}
            aria-label={`Ir a ${label}`}
          >
            {label}
          </Button>
        ))}
      </Box>

      <Grow in={true}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 4,
            pb: 2,
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(to right, #00ffaa, #ff00aa) 1',
            color: 'primary.main',
            textAlign: 'center',
            textShadow: '0 0 10px rgba(0, 255, 170, 0.3)'
          }}
        >
          <Box component="span" sx={{ color: 'secondary.main' }}>KMeans</Box> Model Creator
        </Typography>
      </Grow>

      {error && (
        <Zoom in={true}>
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: '12px',
              bgcolor: 'rgba(198, 40, 40, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(198, 40, 40, 0.3)',
              '& .MuiAlert-icon': {
                color: 'error.main',
                fontSize: '2rem'
              }
            }}
            onClose={() => setError(null)}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>Error</AlertTitle>
            {error}
          </Alert>
        </Zoom>
      )}

      {/* Sección 1: Carga de archivo */}
      <div ref={refCarga} />
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Chip
              label="1"
              color="primary"
              sx={{
                mr: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                width: '32px',
                height: '32px'
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                flexGrow: 1
              }}
            >
              Cargar Datos
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <label htmlFor="csv-upload" style={{ flex: 1 }}>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={procesando}
                style={{ display: 'none' }}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<CloudUpload />}
                disabled={procesando}
                sx={{
                  width: '100%',
                  py: 2,
                  fontSize: '1rem'
                }}
              >
                Seleccionar Archivo CSV
              </Button>
            </label>
          </Box>

          {procesando && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                size={24}
                thickness={4}
                sx={{ color: 'primary.main' }}
              />
              <Typography variant="body1" color="text.secondary">
                Procesando archivo...
              </Typography>
            </Box>
          )}

          {csvFile && !procesando && (
            <Fade in={true}>
              <Alert
                severity="success"
                icon={<CheckCircle fontSize="inherit" />}
                sx={{
                  mt: 2,
                  borderRadius: '8px',
                  bgcolor: 'rgba(46, 125, 50, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="body1">
                  Archivo seleccionado: <strong>{csvFile.name}</strong>
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {csvData.length} registros cargados | {csvHeaders.length} columnas detectadas
                </Typography>
              </Alert>
            </Fade>
          )}
        </StyledPaper>
      </Slide>

      {/* Sección 3: Configuración del modelo */}
      <div ref={refConfig} />
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Chip
              label="3"
              color="info"
              sx={{
                mr: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                width: '32px',
                height: '32px'
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                flexGrow: 1
              }}
            >
              Configurar Modelo
            </Typography>
          </Box>

          {/* Selector de perfiles */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Seleccionar Perfiles (mínimo 2)
            </Typography>
            <FormGroup row sx={{ gap: 2 }}>
              {Object.entries(perfiles).map(([perfil, checked]) => (
                <Paper
                  key={perfil}
                  elevation={checked ? 6 : 1}
                  sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: checked ? '2px solid' : '1px solid',
                    borderColor: checked ? 'secondary.main' : 'divider',
                    bgcolor: checked ? alpha('#ff00aa', 0.1) : 'background.paper'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={() =>
                          setPerfiles((prev) => ({
                            ...prev,
                            [perfil]: !prev[perfil],
                          }))
                        }
                        color="secondary"
                        sx={{
                          ml: 1,
                          '&.Mui-checked': {
                            color: 'secondary.main'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: checked ? 'bold' : 'normal',
                          color: checked ? 'secondary.main' : 'text.primary',
                          pr: 2
                        }}
                      >
                        {perfil}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </FormGroup>
          </Box>

          {/* Preguntas filtradas según perfiles seleccionados */}
          {perfilesSeleccionados.length > 0 && (
            <StyledPaper sx={{ p: 3, mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                Preguntas relevantes para los perfiles seleccionados
              </Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 2
              }}>
                {preguntasFiltradas.map(pregunta => (
                  <Paper key={pregunta.columna} sx={{ p: 2, mb: 1, borderRadius: '10px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {pregunta.texto}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Columna: <strong>{pregunta.columna}</strong>
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </StyledPaper>
          )}

          {/* Número de clusters */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Número de Clusters
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                type="number"
                value={nClusters}
                onChange={(e) => setNClusters(Number(e.target.value))}
                inputProps={{
                  min: 2,
                  max: 4,
                  step: 1
                }}
                sx={{
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  fontStyle: 'italic'
                }}
              >
                Debe coincidir con el número de perfiles seleccionados ({perfilesSeleccionados.length})
              </Typography>
            </Box>
          </Box>

          {/* Nombre del modelo */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Nombre del Modelo
            </Typography>
            <TextField
              value={nombreModelo}
              onChange={(e) => setNombreModelo(e.target.value)}
              placeholder="Escribe un nombre para el modelo"
              fullWidth
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <StyledButton
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handlePredict}
              disabled={procesando || !csvFile || perfilesSeleccionados.length < 2}
              sx={{
                minWidth: '250px',
                py: 1.5,
                fontSize: '1.1rem',
                animation: `${pulse} 2s infinite`,
                '&.Mui-disabled': {
                  animation: 'none',
                  opacity: 0.7
                }
              }}
            >
              {procesando ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Generando Modelo...
                </>
              ) : (
                'Generar Modelo'
              )}
            </StyledButton>
            <StyledButton
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Save />}
              onClick={handleGuardarModelo}
              disabled={procesando || !csvFile || perfilesSeleccionados.length < 2 || !nombreModelo.trim()}
              sx={{
                minWidth: '250px',
                py: 1.5,
                fontSize: '1.1rem',
                animation: `${pulse} 2s infinite`,
                '&.Mui-disabled': {
                  animation: 'none',
                  opacity: 0.7
                }
              }}
            >
              {procesando ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Guardando Modelo...
                </>
              ) : (
                'Guardar Modelo'
              )}
            </StyledButton>
          </Box>
        </StyledPaper>
      </Slide>

      {/* Sección 2: Análisis de datos */}
      <div ref={refAnalisis} />
      {csvData.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip
                label="2"
                color="secondary"
                sx={{
                  mr: 2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  width: '32px',
                  height: '32px'
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  flexGrow: 1
                }}
              >
                Análisis de Datos
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {getEstadisticasGenerales().map((stat, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <StyledPaper sx={{ p: 3, height: '100%' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      color: 'primary.main'
                    }}>
                      {stat.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 1,
                          fontWeight: 'bold',
                          color: 'text.secondary'
                        }}
                      >
                        {stat.nombre}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        textAlign: 'center',
                        textShadow: '0 0 10px rgba(0, 255, 170, 0.2)'
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
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.secondary'
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
                        formatter={(value) => [`${value} respuestas`, 'Cantidad']}
                        contentStyle={{
                          background: 'rgba(17, 34, 64, 0.9)',
                          border: '1px solid rgba(0, 255, 170, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '20px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BarChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.secondary'
                      }}
                    >
                      Distribución por Columna (Top 5)
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getDistribucionPorColumna()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={alpha('#00ffaa', 0.1)}
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
                        formatter={(value) => [`${value} respuestas`, 'Cantidad']}
                        labelFormatter={(label) => `Columna: ${label}`}
                        contentStyle={{
                          background: 'rgba(17, 34, 64, 0.9)',
                          border: '1px solid rgba(0, 255, 170, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '20px'
                        }}
                      />
                      <Bar dataKey="A" name="A" stackId="a" fill="#00ffaa" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="B" name="B" stackId="a" fill="#ff00aa" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="C" name="C" stackId="a" fill="#00aaff" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="D" name="D" stackId="a" fill="#aa00ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
            </Grid>

            {/* Sección columnas */}
            <div ref={refColumnas} />
            <StyledPaper sx={{ p: 3, mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <TableChart color="primary" sx={{ mr: 1 }} />
                Seleccionar Columnas para Análisis
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Las columnas se auto-seleccionan según los perfiles elegidos, pero puedes modificarlas manualmente
              </Typography>

              {/* Botones de acción rápida */}
              {perfilesSeleccionados.length > 0 && (
                <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => {
                      const columnasRecomendadas = getColumnasRecomendadas;
                      const columnasDisponibles = csvHeaders.filter(h => columnasRecomendadas.includes(h));
                      setSelectedColumns(columnasDisponibles);
                    }}
                    sx={{ borderRadius: '20px' }}
                  >
                    Auto-seleccionar para {perfilesSeleccionados.join(' + ')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => setSelectedColumns([])}
                    sx={{ borderRadius: '20px' }}
                  >
                    Limpiar Selección
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => {
                      setSelectedColumns(todasLasColumnas);
                    }}
                    sx={{ borderRadius: '20px' }}
                  >
                    Seleccionar Todas
                  </Button>
                </Box>
              )}

              {/* Indicador de columnas recomendadas */}
              {perfilesSeleccionados.length > 0 && getColumnasRecomendadas.length > 0 && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: '12px',
                    bgcolor: 'rgba(2, 136, 209, 0.1)',
                    border: '1px solid rgba(2, 136, 209, 0.3)'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Columnas recomendadas para {perfilesSeleccionados.join(' + ')}:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {getColumnasRecomendadas.join(', ')}
                  </Typography>
                </Alert>
              )}

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 1,
                maxHeight: '300px',
                overflowY: 'auto',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                bgcolor: 'background.default'
              }}>
                {todasLasColumnas.map((header) => {
                  const esRecomendada = getColumnasRecomendadas.includes(header);
                  const estaSeleccionada = selectedColumns.includes(header);
                  const esVirtual = columnasVirtuales.includes(header);

                  return (
                    <FormControlLabel
                      key={header}
                      control={
                        <Checkbox
                          checked={estaSeleccionada}
                          onChange={() => handleColumnSelection(header)}
                          color="primary"
                          sx={{
                            '&.Mui-checked': {
                              color: esRecomendada ? 'secondary.main' : 'primary.main'
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <MuiTooltip title={header} placement="top">
                            <Typography 
                              variant="body2"
                              sx={{
                                fontWeight: esRecomendada ? 'bold' : 'normal',
                                color: esRecomendada ? 'secondary.main' : 'text.primary'
                              }}
                            >
                              {header.length > 22 ? header.substring(0, 22) + '...' : header}
                            </Typography>
                          </MuiTooltip>
                          {esRecomendada && (
                            <Chip
                              label="Recomendada"
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{
                                ml: 1,
                                height: '20px',
                                fontSize: '0.6rem',
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          )}
                          {esVirtual && (
                            <Chip
                              label=""
                              size="small"
                              color="info"
                              variant="outlined"
                              sx={{
                                ml: 1,
                                height: '20px',
                                fontSize: '0.6rem',
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          )}
                        </Box>
                      }
                      sx={{
                        m: 0,
                        width: '100%',
                        p: 1,
                        borderRadius: '6px',
                        bgcolor: esRecomendada ? alpha('#ff00aa', 0.05) : 'transparent',
                        border: esRecomendada ? '1px solid' : '1px solid transparent',
                        borderColor: esRecomendada ? alpha('#ff00aa', 0.2) : 'transparent',
                        '&:hover': {
                          bgcolor: esRecomendada ? alpha('#ff00aa', 0.1) : 'action.hover',
                        }
                      }}
                    />
                  );
                })}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mt: 1,
                  textAlign: 'right'
                }}
              >
                Seleccionadas: <strong>{selectedColumns.length}</strong> de {todasLasColumnas.length} columnas disponibles
                {getColumnasRecomendadas.length > 0 && (
                  <span style={{ marginLeft: '10px' }}>
                    | Recomendadas: <strong style={{ color: '#ff00aa' }}>{getColumnasRecomendadas.length}</strong>
                  </span>
                )}
              </Typography>
            </StyledPaper>

            <StyledPaper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Info color="primary" sx={{ mr: 1 }} />
                Previsualización de Datos
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Mostrando las primeras 5 filas del dataset cargado
              </Typography>

              <TableContainer
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: '400px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'primary.main',
                    borderRadius: '4px'
                  }
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {csvHeaders.slice(0, 10).map(header => (
                        <StyledTableCell
                          key={header}
                          className="header"
                        >
                          <MuiTooltip title={header} placement="top">
                            <Typography variant="subtitle2">
                              {header.length > 15 ? header.substring(0, 15) + '...' : header}
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
                          '&:nth-of-type(odd)': {
                            bgcolor: 'background.default'
                          },
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        {csvHeaders.slice(0, 10).map(header => (
                          <StyledTableCell
                            key={header}
                            sx={{
                              bgcolor: selectedColumns.includes(header) ? alpha('#00ffaa', 0.1) : 'transparent'
                            }}
                          >
                            <Typography variant="body2">
                              {row[header] || '-'}
                            </Typography>
                          </StyledTableCell>
                        ))}
                        {csvHeaders.length > 10 && (
                          <StyledTableCell>
                            <Typography variant="body2">...</Typography>
                          </StyledTableCell>
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

      {/* Sección 4: Resultados del modelo */}
      <div ref={refResultados} />
      {resultados.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <StyledPaper elevation={12} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip
                label="4"
                color="warning"
                sx={{
                  mr: 2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  width: '32px',
                  height: '32px'
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  flexGrow: 1
                }}
              >
                Resultados del Modelo
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
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
                          <Cell key={`cell-p-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BarChartIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      Distribución por Cluster
                    </Typography>
                  </Box>
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
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <RadarIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      Promedio Puntaje por Perfil
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={getPromedioPuntajePorPerfil()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="perfil" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar
                        name="Promedio"
                        dataKey="promedio"
                        stroke="#ff00aa"
                        fill="#ff00aa"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(2)} pts`, 'Promedio']}
                        contentStyle={{
                          background: 'rgba(17, 34, 64, 0.9)',
                          border: '1px solid rgba(255, 0, 170, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Timeline color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      Evolución de Puntaje por Registro
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getEvolucionPuntaje()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} pts`, 'Puntaje']}
                        contentStyle={{
                          background: 'rgba(17, 34, 64, 0.9)',
                          border: '1px solid rgba(0, 255, 170, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="puntaje" stroke="#00ffaa" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Grid>
            </Grid>

            <StyledPaper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                Distribución por Nombre
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getDistribucionPorNombre()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} registros`, 'Cantidad']}
                    contentStyle={{
                      background: 'rgba(17, 34, 64, 0.9)',
                      border: '1px solid rgba(0, 255, 170, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
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

      {/* Final */}
      <div ref={refFinal} />
      <Box sx={{
        mt: 6,
        mb: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowUpward />}
          onClick={() => scrollToRef(refInicio)}
          sx={{ borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem', px: 3, py: 1 }}
          aria-label="Ir al inicio"
        >
          Ir al inicio
        </Button>
      </Box>
    </Box>
  );
}