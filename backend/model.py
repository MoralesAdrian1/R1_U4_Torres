import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Columnas del CSV
COLUMNAS = [
    "AdopcionProductoNuevo","FactorMarcaImportante","AntesCompraImportante","TiempoInvestigacionCompra",
    "ProbarRestauranteNuevo","ReaccionOfertasTiempoLimitado","InfluenciaOpinionesOtros","ContenidoRedesSociales",
    "MotivacionCompra","CuandoBuenaCompra","PostCompraConducta","FrecuenciaCambioMarca",
    "EleccionVacaciones","ProductoNuevoSupermercado","RelacionTendenciaModa"
]

PERFILES_TODOS = ["conservador", "innovador", "pragmatico", "emocional"]

# Mapeo homogéneo para todas las columnas: A->conservador, B->innovador, C->pragmatico, D->emocional
MAPPING = {}
for col in COLUMNAS:
    MAPPING[col] = {
        "A": {"conservador": 4},
        "B": {"innovador": 4},
        "C": {"pragmatico": 4},
        "D": {"emocional": 4},
    }

def respuestas_a_vector(df, perfiles_usados):
    vectores = []
    for _, row in df.iterrows():
        scores = dict.fromkeys(perfiles_usados, 0)
        for col in COLUMNAS:
            if col not in df.columns:
                continue  # Ignorar columnas que no estén
            resp = str(row[col]).strip().upper()
            if resp in MAPPING[col]:
                for perfil, pts in MAPPING[col][resp].items():
                    if perfil in perfiles_usados:
                        scores[perfil] += pts
        vectores.append([scores[p] for p in perfiles_usados])
    return pd.DataFrame(vectores, columns=perfiles_usados)

class KMeansModel:
    def __init__(self, n_clusters=4, perfiles_elegidos=None, random_state=42):
        if perfiles_elegidos is None:
            perfiles_elegidos = PERFILES_TODOS
        self.perfiles_elegidos = [p.lower() for p in perfiles_elegidos]
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=self.n_clusters, random_state=self.random_state, n_init=20)
        self.cluster_perfiles = []

    def fit(self, df):
        # Obtener matriz de puntajes solo con perfiles elegidos
        X = respuestas_a_vector(df, self.perfiles_elegidos)
        X_scaled = self.scaler.fit_transform(X)
        self.kmeans.fit(X_scaled)

        centroides = self.kmeans.cluster_centers_
        centroides_orig = self.scaler.inverse_transform(centroides)

        self.cluster_perfiles = []
        # Mapear cada cluster al perfil con valor máximo dentro de perfiles elegidos
        for centroide in centroides_orig:
            max_idx = centroide.argmax()
            perfil = self.perfiles_elegidos[max_idx].capitalize()
            self.cluster_perfiles.append(perfil)

    def predict(self, df):
        X = respuestas_a_vector(df, self.perfiles_elegidos)
        X_scaled = self.scaler.transform(X)
        clusters = self.kmeans.predict(X_scaled)

        resultados = []
        for i in range(len(df)):
            perfil_asignado = self.cluster_perfiles[clusters[i]].lower()  # perfil asignado (minusculas)
            puntajes_fila = {p: X.iloc[i][p] for p in self.perfiles_elegidos}  # puntajes vector fila
            puntaje_perfil = puntajes_fila.get(perfil_asignado, 0)  # puntaje para el perfil asignado

            resultado = {
                "nombre": df.iloc[i]["nombre"] if "nombre" in df.columns else None,
                "cluster": int(clusters[i]),
                "perfil_estimado": self.cluster_perfiles[clusters[i]],
                "puntaje_perfil": int(puntaje_perfil)  # <-- convertir a int nativo
            }
            resultados.append(resultado)
        return resultados



