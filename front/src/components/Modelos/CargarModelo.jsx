import React, { useState, useEffect } from "react";

export default function VisualizarModelo() {
  const [modelosGuardados, setModelosGuardados] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/modelos_guardados/")
      .then((res) => res.json())
      .then(setModelosGuardados)
      .catch(console.error);
  }, []);

  const cargarModelo = async (nombre) => {
    if (!nombre) {
      setModeloSeleccionado(null);
      return;
    }
    const res = await fetch(`http://localhost:8000/modelos_guardados/${nombre}`);
    if (!res.ok) {
      alert("No se pudo cargar el modelo");
      return;
    }
    const data = await res.json();
    setModeloSeleccionado(data);
  };

  return (
    <div>
      <h2>Visualizar modelo guardado</h2>
      <label>Selecciona un modelo guardado: </label>
      <select
        onChange={(e) => cargarModelo(e.target.value)}
        value={modeloSeleccionado?.nombre_modelo || ""}
      >
        <option value="">--Seleccione--</option>
        {modelosGuardados.map((m) => (
          <option key={m.nombre_modelo} value={m.nombre_modelo}>
            {m.nombre_modelo}
          </option>
        ))}
      </select>

      {modeloSeleccionado && (
        <div style={{ marginTop: 20 }}>
          <h3>Datos del modelo: {modeloSeleccionado.nombre_modelo}</h3>
          <p>
            Número de clusters: {modeloSeleccionado.n_clusters}
            <br />
            Perfiles: {modeloSeleccionado.perfiles.join(", ")}
            <br />
            Cluster perfiles: {modeloSeleccionado.cluster_perfiles.join(", ")}
          </p>

          <h4>Resultados</h4>
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
              {modeloSeleccionado.resultados.map((r, idx) => (
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
