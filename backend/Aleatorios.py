import pandas as pd
import random

PREGUNTAS = {
    "AdopcionProductoNuevo": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "FactorMarcaImportante": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "AntesCompraImportante": {
        'A': {'Conservador': 3, 'Pragmático': 1},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "TiempoInvestigacionCompra": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 2, 'Emocional': 2},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 3, 'Innovador': 1}
    },
    "ProbarRestauranteNuevo": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "ReaccionOfertasTiempoLimitado": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 3, 'Emocional': 1},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "InfluenciaOpinionesOtros": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "ContenidoRedesSociales": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "MotivacionCompra": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "CuandoBuenaCompra": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "PostCompraConducta": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "FrecuenciaCambioMarca": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "EleccionVacaciones": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "ProductoNuevoSupermercado": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    },
    "RelacionTendenciaModa": {
        'A': {'Conservador': 4},
        'B': {'Innovador': 4},
        'C': {'Pragmático': 4},
        'D': {'Emocional': 4}
    }
}

PERFILES = ["Conservador", "Innovador", "Pragmático", "Emocional"]

PESOS_BASE = {
    "Conservador": [0.6, 0.1, 0.2, 0.1],
    "Innovador":   [0.1, 0.6, 0.1, 0.2],
    "Pragmático":  [0.2, 0.1, 0.6, 0.1],
    "Emocional":   [0.1, 0.2, 0.1, 0.6]
}
NOMBRES = [
    "Ana", "Luis", "Carlos", "María", "Jorge", "Lucía", "Pedro", "Sofía",
    "Miguel", "Elena", "Diego", "Valeria", "José", "Isabel", "Andrés", "Paula"
]
def generar_encuesta(perfil_dominante):
    respuestas = {}
    puntajes = {p: 0 for p in PERFILES}
    
    for nombre_pregunta, opciones in PREGUNTAS.items():
        opciones_letras = list(opciones.keys())
        
        base_pesos = PESOS_BASE[perfil_dominante]
        pesos_ruido = [max(0, w + random.uniform(-0.05, 0.05)) for w in base_pesos]
        
        respuesta = random.choices(opciones_letras, weights=pesos_ruido, k=1)[0]
        respuestas[nombre_pregunta] = respuesta
        
        for perfil, puntos in opciones[respuesta].items():
            puntajes[perfil] += puntos
    
    perfil_final = max(puntajes, key=puntajes.get)
    return respuestas, puntajes, perfil_final

def generar_dataset(n=300, archivo_salida="dataset_consumidores.csv"):
    data = []
    for _ in range(n):
        perfil = random.choice(PERFILES)
        resp, pts, perfil_final = generar_encuesta(perfil)
        fila = resp
        fila["nombre"] = random.choice(NOMBRES)
        data.append(fila)
    
    df = pd.DataFrame(data)
    df.to_csv(archivo_salida, index=False, encoding="utf-8-sig")
    print(f"Dataset generado: {archivo_salida} ({n} registros)")

# Ejemplo de uso
generar_dataset(100,"data.csv")
