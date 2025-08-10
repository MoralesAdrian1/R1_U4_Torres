from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import pandas as pd
from io import StringIO
from model import KMeansModel, PERFILES_TODOS
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],         
)

MODELOS_DIR = "modelos_guardados"
os.makedirs(MODELOS_DIR, exist_ok=True)

@app.post("/predict/")
async def predict(
    csv_file: UploadFile = File(...), 
    n_clusters: int = Form(...),
    perfiles: str = Form(...),
):
    content = await csv_file.read()
    s = content.decode('utf-8')
    df = pd.read_csv(StringIO(s))

    perfiles_list = [p.strip().lower() for p in perfiles.split(",")]
    if len(perfiles_list) < 2 or len(perfiles_list) > 4:
        return {"error": "Debe elegir entre 2 y 4 perfiles"}

    for p in perfiles_list:
        if p not in [x.lower() for x in PERFILES_TODOS]:
            return {"error": f"Perfil inválido: {p}"}

    if n_clusters != len(perfiles_list):
        return {"error": "n_clusters debe ser igual al número de perfiles elegidos"}

    model = KMeansModel(n_clusters=n_clusters, perfiles_elegidos=perfiles_list)
    model.fit(df)
    resultados = model.predict(df)

    return {"resultados": resultados, "cluster_perfiles": model.cluster_perfiles}


@app.post("/guardar_modelo/")
async def guardar_modelo(
    csv_file: UploadFile = File(...),
    nombre_modelo: str = Form(...),
    n_clusters: int = Form(...),
    perfiles: str = Form(...)
):
    content = await csv_file.read()
    s = content.decode('utf-8')
    df = pd.read_csv(StringIO(s))

    perfiles_list = [p.strip().lower() for p in perfiles.split(",")]
    if len(perfiles_list) < 2 or len(perfiles_list) > 4:
        raise HTTPException(status_code=400, detail="Debe elegir entre 2 y 4 perfiles")

    for p in perfiles_list:
        if p not in [x.lower() for x in PERFILES_TODOS]:
            raise HTTPException(status_code=400, detail=f"Perfil inválido: {p}")

    if n_clusters != len(perfiles_list):
        raise HTTPException(status_code=400, detail="n_clusters debe ser igual al número de perfiles elegidos")

    model = KMeansModel(n_clusters=n_clusters, perfiles_elegidos=perfiles_list)
    model.fit(df)
    resultados = model.predict(df)

    modelo_data = {
        "nombre_modelo": nombre_modelo,
        "n_clusters": n_clusters,
        "perfiles": perfiles_list,
        "resultados": resultados,
        "cluster_perfiles": model.cluster_perfiles
    }

    filepath = os.path.join(MODELOS_DIR, f"{nombre_modelo}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(modelo_data, f, ensure_ascii=False, indent=4)

    return {"message": "Modelo guardado exitosamente", "nombre_modelo": nombre_modelo}


@app.get("/modelos_guardados/")
async def listar_modelos():
    archivos = os.listdir(MODELOS_DIR)
    modelos = []
    for archivo in archivos:
        if archivo.endswith(".json"):
            with open(os.path.join(MODELOS_DIR, archivo), "r", encoding="utf-8") as f:
                data = json.load(f)
                modelos.append({
                    "nombre_modelo": data.get("nombre_modelo"),
                    "n_clusters": data.get("n_clusters"),
                    "perfiles": data.get("perfiles"),
                    "cluster_perfiles": data.get("cluster_perfiles")
                })
    return modelos


@app.get("/modelos_guardados/{nombre_modelo}")
async def obtener_modelo(nombre_modelo: str):
    filepath = os.path.join(MODELOS_DIR, f"{nombre_modelo}.json")
    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail="Modelo no encontrado")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
