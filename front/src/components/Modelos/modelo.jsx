import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function NuevoModelo() {
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

  // Columnas esperadas para el análisis
  const columnasEsperadas = [
    "AdopcionProductoNuevo","FactorMarcaImportante","AntesCompraImportante","TiempoInvestigacionCompra",
    "ProbarRestauranteNuevo","ReaccionOfertasTiempoLimitado","InfluenciaOpinionesOtros","ContenidoRedesSociales",
    "MotivacionCompra","CuandoBuenaCompra","PostCompraConducta","FrecuenciaCambioMarca",
    "EleccionVacaciones","ProductoNuevoSupermercado","RelacionTendenciaModa"
  ];

  const perfilesSeleccionados = Object.entries(perfiles)
    .filter(([_, checked]) => checked)
    .map(([perfil]) => perfil);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // Función para procesar el CSV
  const procesarCSV = (text) => {
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
    
    // Seleccionar automáticamente las columnas que coincidan con las esperadas
    const columnasDisponibles = headers.filter(h => columnasEsperadas.includes(h));
    setSelectedColumns(columnasDisponibles);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const text = await file.text();
      procesarCSV(text);
    }
  };

  const handleColumnSelection = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  // Generar datos para gráficas
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
      respuesta,
      cantidad
    }));
  };

  const getEstadisticasGenerales = () => {
    return [
      { nombre: 'Total Registros', valor: csvData.length },
      { nombre: 'Columnas Totales', valor: csvHeaders.length },
      { nombre: 'Columnas Seleccionadas', valor: selectedColumns.length },
      { nombre: 'Registros con Nombre', valor: csvData.filter(row => row.nombre).length }
    ];
  };

  const getDistribucionPorColumna = () => {
    if (!selectedColumns.length) return [];
    
    return selectedColumns.slice(0, 5).map(column => {
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

  const handlePredict = async () => {
    if (!csvFile) {
      alert("Carga un archivo CSV");
      return;
    }
    if (perfilesSeleccionados.length < 2) {
      alert("Selecciona al menos 2 perfiles");
      return;
    }
    if (nClusters !== perfilesSeleccionados.length) {
      alert("n_clusters debe ser igual al número de perfiles seleccionados");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("n_clusters", nClusters);
    formData.append("perfiles", perfilesSeleccionados.join(","));

    try {
      const res = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setResultados(data.resultados);
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  const handleGuardarModelo = async () => {
    if (!csvFile) {
      alert("Carga un archivo CSV");
      return;
    }
    if (!nombreModelo.trim()) {
      alert("Escribe un nombre para el modelo");
      return;
    }
    if (perfilesSeleccionados.length < 2) {
      alert("Selecciona al menos 2 perfiles");
      return;
    }
    if (nClusters !== perfilesSeleccionados.length) {
      alert("n_clusters debe ser igual al número de perfiles seleccionados");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("nombre_modelo", nombreModelo);
    formData.append("n_clusters", nClusters);
    formData.append("perfiles", perfilesSeleccionados.join(","));

    try {
      const res = await fetch("http://localhost:8000/guardar_modelo/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.message) {
        alert(data.message);
        setNombreModelo("");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Crear y guardar nuevo modelo</h2>
      
      <div>
        <div style={{ marginBottom: '20px' }}>
          <label>Archivo CSV: </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginLeft: '10px' }}
          />
        </div>

        {/* Previsualización y estadísticas del CSV */}
        {csvData.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3>Análisis del CSV cargado</h3>
            
            {/* Estadísticas generales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {getEstadisticasGenerales().map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '15px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{stat.valor}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{stat.nombre}</div>
                </div>
              ))}
            </div>

            {/* Gráficas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {/* Distribución general de respuestas */}
              <div>
                <h4>Distribución General de Respuestas</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getDistribucionRespuestas()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="cantidad"
                      label={({respuesta, cantidad}) => `${respuesta}: ${cantidad}`}
                    >
                      {getDistribucionRespuestas().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Distribución por columnas */}
              <div>
                <h4>Distribución por Columna (Top 5)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getDistribucionPorColumna()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="columna" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="A" stackId="a" fill="#8884d8" />
                    <Bar dataKey="B" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="C" stackId="a" fill="#ffc658" />
                    <Bar dataKey="D" stackId="a" fill="#ff7c7c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Selector de columnas */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Seleccionar Columnas para Análisis</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '5px'
              }}>
                {csvHeaders.filter(header => header !== 'nombre').map((header) => (
                  <label key={header} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(header)}
                      onChange={() => handleColumnSelection(header)}
                      style={{ marginRight: '8px' }}
                    />
                    <span title={header}>
                      {header.length > 30 ? header.substring(0, 30) + '...' : header}
                    </span>
                  </label>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Seleccionadas: {selectedColumns.length} de {csvHeaders.length} columnas disponibles
              </p>
            </div>

            {/* Previsualización de datos */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Previsualización de Datos (Primeras 5 filas)</h4>
              <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      {csvHeaders.slice(0, 10).map(header => (
                        <th key={header} style={{ 
                          padding: '8px', 
                          border: '1px solid #ddd',
                          backgroundColor: selectedColumns.includes(header) ? '#e3f2fd' : '#f8f9fa'
                        }}>
                          {header.length > 15 ? header.substring(0, 15) + '...' : header}
                        </th>
                      ))}
                      {csvHeaders.length > 10 && <th style={{ padding: '8px', border: '1px solid #ddd' }}>...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {csvHeaders.slice(0, 10).map(header => (
                          <td key={header} style={{ 
                            padding: '6px', 
                            border: '1px solid #ddd',
                            backgroundColor: selectedColumns.includes(header) ? '#f3e5f5' : 'white'
                          }}>
                            {row[header]}
                          </td>
                        ))}
                        {csvHeaders.length > 10 && <td style={{ padding: '6px', border: '1px solid #ddd' }}>...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Selecciona perfiles (mínimo 2): </label>
          {Object.keys(perfiles).map((perfil) => (
            <label key={perfil} style={{ marginLeft: 15 }}>
              <input
                type="checkbox"
                checked={perfiles[perfil]}
                onChange={() =>
                  setPerfiles((prev) => ({
                    ...prev,
                    [perfil]: !prev[perfil],
                  }))
                }
              />
              {perfil}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Número de clusters:
            <input
              type="number"
              min={2}
              max={4}
              value={nClusters}
              onChange={(e) => setNClusters(Number(e.target.value))}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <button onClick={handlePredict} style={{ marginTop: 10, padding: '10px 20px' }}>
          Predecir
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Guardar modelo</h3>
        <input
          type="text"
          placeholder="Nombre del modelo"
          value={nombreModelo}
          onChange={(e) => setNombreModelo(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="button" onClick={handleGuardarModelo} style={{ padding: '8px 16px' }}>
          Guardar modelo
        </button>
      </div>

      {resultados.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Resultados</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1} cellPadding={8}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th>Nombre</th>
                  <th>Cluster</th>
                  <th>Perfil Estimado</th>
                  <th>Puntaje Perfil</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.nombre || "-"}</td>
                    <td>{r.cluster}</td>
                    <td>{r.perfil_estimado}</td>
                    <td>{r.puntaje_perfil || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
