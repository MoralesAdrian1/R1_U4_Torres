import { useState } from 'react'

import './App.css'
import VisualizarModelo from './components/Modelos/CargarModelo';
import NuevoModelo from './components/Modelos/modelo';

function App() {
  const [modo, setModo] = useState("nuevo"); // "nuevo" o "visualizar"

  return (
    <div style={{ padding: 20 }}>
      <h1>Modelo KMeans - Clasificación Perfiles</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="radio"
            checked={modo === "visualizar"}
            onChange={() => setModo("visualizar")}
          />{" "}
          Visualizar modelo guardado
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            checked={modo === "nuevo"}
            onChange={() => setModo("nuevo")}
          />{" "}
          Crear y guardar nuevo modelo
        </label>
      </div>

      {modo === "visualizar" ? <VisualizarModelo /> : <NuevoModelo />}
    </div>
  );
}

export default App
