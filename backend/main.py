from fastapi import FastAPI, UploadFile, File
import pandas as pd
from io import StringIO
from model import KMeansModel, PERFILES_TODOS

app = FastAPI()

@app.post("/predict/")
async def predict(
    csv_file: UploadFile = File(...), 
    n_clusters: int = 4,
    perfiles: str = "conservador,innovador,pragmatico,emocional"
):
    content = await csv_file.read()
    s = content.decode('utf-8')
    df = pd.read_csv(StringIO(s))

    # Validar perfiles enviados
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
