import React, { useState } from "react";

export default function NuevoModelo() {
  const [csvFile, setCsvFile] = useState(null);
  const [nClusters, setNClusters] = useState(2);
  const [perfiles, setPerfiles] = useState({
    conservador: false,
    innovador: false,
    pragmatico: false,
    emocional: false,
  });
  const [nombreModelo, setNombreModelo] = useState("");
  const [resultados, setResultados] = useState([]);

  const perfilesSeleccionados = Object.entries(perfiles)
    .filter(([_, checked]) => checked)
    .map(([perfil]) => perfil);

  const handlePredict = async (e) => {
    e.preventDefault();
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

    const res = await fetch("http://localhost:8000/guardar_modelo/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.message) {
      alert(data.message);
      setNombreModelo("");
    }
  };

  return (
    <div>
      <h2>Crear y guardar nuevo modelo</h2>
      <form onSubmit={handlePredict}>
        <div>
          <label>Archivo CSV: </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
          />
        </div>

        <div>
          <label>Selecciona perfiles (mínimo 2): </label>
          {Object.keys(perfiles).map((perfil) => (
            <label key={perfil} style={{ marginLeft: 10 }}>
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

        <div>
          <label>
            Número de clusters:
            <input
              type="number"
              min={2}
              max={4}
              value={nClusters}
              onChange={(e) => setNClusters(Number(e.target.value))}
            />
          </label>
        </div>

        <button type="submit" style={{ marginTop: 10 }}>
          Predecir
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <h3>Guardar modelo</h3>
        <input
          type="text"
          placeholder="Nombre del modelo"
          value={nombreModelo}
          onChange={(e) => setNombreModelo(e.target.value)}
        />
        <button type="button" onClick={handleGuardarModelo} style={{ marginLeft: 10 }}>
          Guardar modelo
        </button>
      </div>

      {resultados.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Resultados</h3>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
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
      )}
    </div>
  );
}
