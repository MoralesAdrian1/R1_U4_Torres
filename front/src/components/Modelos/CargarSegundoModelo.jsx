import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Slide,
  Fade,
  Alert,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUpload, CheckCircle } from "@mui/icons-material";
import EstadisticaRes from "./segundaPrediccion/estadisticaResultados";
import EstadisticaGen from "./segundaPrediccion/EstadisticaGeneral";

const StyledPaper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[12]
}));

export default function SegundoModelo({ n_clusters, perfiles }) {
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  const [generar,setGenerar] = useState(false);
    const[resultados,setResultados] = useState([]);
  const refCarga = useRef(null);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setCsvFile(file);
  setError(null);
  setCsvData([]);
  setCsvHeaders([]);

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    const text = evt.target.result;

    // Parse CSV simple:
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",");

    // Mapeamos a objetos para facilitar uso:
    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || "";
      });
      return obj;
    });

    setCsvHeaders(headers);
    setCsvData(data);
  };

  reader.readAsText(file);
};


  const handlePredict = async () => {
    if (!csvFile) {
      setError("Debes cargar un archivo CSV primero");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("n_clusters", n_clusters);
    formData.append("perfiles", perfiles.join(","));

    try {
      setProcesando(true);
      setError(null);
      const res = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Resultados recibidos:", data.resultados);
      setResultados(data.resultados);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
      console.error("Error en predicción:", err);
    } finally {
      setProcesando(false);
      setGenerar(true);
    }
  };

  return (
    <>
      {/* Sección 1: Carga de archivo */}
      <div ref={refCarga} />
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <StyledPaper>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Chip
              label="1"
              color="primary"
              sx={{
                mr: 2,
                fontWeight: "bold",
                fontSize: "1rem",
                width: "32px",
                height: "32px"
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                flexGrow: 1
              }}
            >
              Cargar Datos
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <label htmlFor="csv-upload" style={{ flex: 1 }}>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={procesando}
                style={{ display: "none" }}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<CloudUpload />}
                disabled={procesando}
                sx={{
                  width: "100%",
                  py: 2,
                  fontSize: "1rem"
                }}
              >
                Seleccionar Archivo CSV
              </Button>
            </label>
          </Box>

          {procesando && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={24} thickness={4} sx={{ color: "primary.main" }} />
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
                  borderRadius: "8px",
                  bgcolor: "rgba(46, 125, 50, 0.2)",
                  backdropFilter: "blur(10px)"
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
      
      {csvData.length > 0 && !generar && (
  <EstadisticaGen csvData={csvData} csvHeaders={csvHeaders} perfiles={perfiles} />
)}

    <Button onClick={handlePredict}>predecir</Button>
      {generar && <EstadisticaRes resultados={resultados} />}
    </>
  );
}
