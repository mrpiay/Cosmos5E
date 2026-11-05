/* Datos del cuestionario conceptual (embebidos para funcionar offline; fetch de file:// esta bloqueado por CORS). Fuente canonica: datos/test_conceptual_v2.json */
window.TEST_CONCEPTUAL = {
  "meta": {
    "titulo": "Cuestionario conceptual pre/post",
    "descripcion": "Mismo instrumento en Engage (pre, sin corrección) y Evaluate (post, con retroalimentación). Enunciados y opciones alineados con el Anexo C de la memoria. 15 ítems de opción múltiple.",
    "version": "v2",
    "n_items": 15
  },
  "items": [
    {
      "id": 1,
      "oa": "OA4",
      "concepto": "Qué es la edad del universo",
      "etiqueta": "La edad del universo",
      "enunciado": "Cuando decimos que el universo tiene unos 13 800 millones de años, ¿a qué nos referimos?",
      "opciones": [
        {
          "texto": "A la edad de la Vía Láctea.",
          "correcta": false,
          "feedback": "La edad del universo no es la de una galaxia concreta: es la de todo el cosmos desde su origen."
        },
        {
          "texto": "Al tiempo transcurrido desde el estado temprano caliente y denso asociado al Big Bang y la evolución expansiva posterior.",
          "correcta": true,
          "feedback": "Correcto: es el tiempo desde ese estado temprano caliente y denso, no la edad de ningún astro concreto."
        },
        {
          "texto": "A la edad del Sol y del Sistema Solar.",
          "correcta": false,
          "feedback": "El Sol tiene unos 4 600 millones de años; el universo es mucho más antiguo."
        }
      ]
    },
    {
      "id": 2,
      "oa": "OA4",
      "concepto": "El Big Bang no es una explosión en el espacio",
      "etiqueta": "El Big Bang",
      "enunciado": "¿Qué describe mejor el Big Bang?",
      "opciones": [
        {
          "texto": "Una explosión que lanzó materia desde un punto hacia un espacio vacío preexistente.",
          "correcta": false,
          "feedback": "Idea errónea: el Big Bang no fue una explosión EN un espacio que ya existía."
        },
        {
          "texto": "Un estado temprano extremadamente caliente y denso y la evolución expansiva posterior, sin un centro espacial privilegiado.",
          "correcta": true,
          "feedback": "Correcto: un estado temprano muy caliente y denso cuya expansión describe el modelo, sin un centro."
        },
        {
          "texto": "La explosión de una estrella en el centro del universo.",
          "correcta": false,
          "feedback": "Ni fue una estrella ni hubo un «centro»."
        }
      ]
    },
    {
      "id": 3,
      "oa": "OA4",
      "concepto": "El universo no tiene centro ni borde",
      "etiqueta": "¿Tiene centro el universo?",
      "enunciado": "Si a gran escala las galaxias no ligadas se alejan unas de otras, ¿significa que estamos en el centro del universo?",
      "opciones": [
        {
          "texto": "Sí, la Tierra ocupa el centro.",
          "correcta": false,
          "feedback": "Idea errónea: desde cualquier galaxia se vería lo mismo. No hay un centro privilegiado."
        },
        {
          "texto": "No; en una expansión aproximadamente homogénea distintos observadores comóviles describen el mismo patrón sin un centro privilegiado.",
          "correcta": true,
          "feedback": "Correcto: la expansión no tiene centro; cualquier observador comóvil ve alejarse a las demás."
        },
        {
          "texto": "Sí, pero el centro está en la Vía Láctea.",
          "correcta": false,
          "feedback": "Sigue suponiendo un centro, que no existe."
        }
      ]
    },
    {
      "id": 4,
      "oa": "OA4",
      "concepto": "Universo observable frente a universo total",
      "etiqueta": "El tamaño del universo",
      "enunciado": "Cuando hablamos del «tamaño del universo» en esta secuencia, ¿qué magnitud se discute?",
      "opciones": [
        {
          "texto": "El tamaño total del universo, que tiene un borde conocido.",
          "correcta": false,
          "feedback": "Idea errónea: no conocemos borde ni tamaño total; podría ser infinito."
        },
        {
          "texto": "El tamaño del universo observable, no el del universo total.",
          "correcta": true,
          "feedback": "Correcto: siempre medimos lo observable; del universo total no sabemos ni tamaño ni borde."
        },
        {
          "texto": "La distancia a la galaxia más lejana que existe.",
          "correcta": false,
          "feedback": "No es «la más lejana que existe», sino hasta donde su luz ha podido llegarnos."
        }
      ]
    },
    {
      "id": 5,
      "oa": "OA2",
      "concepto": "Mirar lejos es mirar al pasado (look-back time)",
      "etiqueta": "Ver galaxias muy lejanas",
      "enunciado": "La luz que recibimos de una galaxia fue emitida hace 1 000 millones de años. La observamos…",
      "opciones": [
        {
          "texto": "tal como es ahora mismo;",
          "correcta": false,
          "feedback": "No: la luz que recibimos salió hace mucho tiempo."
        },
        {
          "texto": "tal como era cuando emitió esa luz; mirar lejos implica mirar al pasado;",
          "correcta": true,
          "feedback": "Correcto: la vemos como era cuando su luz partió (look-back time)."
        },
        {
          "texto": "con 1 000 millones de años de adelanto;",
          "correcta": false,
          "feedback": "Es al revés: la vemos con retraso, no con adelanto."
        }
      ]
    },
    {
      "id": 6,
      "oa": "OA2",
      "concepto": "Medida del corrimiento al rojo z = Δλ/λ",
      "etiqueta": "Medir el corrimiento al rojo (z)",
      "enunciado": "Una línea que en reposo está en 656 nm aparece en 663 nm. El corrimiento al rojo se obtiene como…",
      "opciones": [
        {
          "texto": "v/d;",
          "correcta": false,
          "feedback": "Eso sería la constante de Hubble (v/d), no z."
        },
        {
          "texto": "z = (663 − 656) / 656;",
          "correcta": true,
          "feedback": "Correcto: z = Δλ/λ es el desplazamiento relativo de la línea, adimensional."
        },
        {
          "texto": "el brillo respecto de una referencia;",
          "correcta": false,
          "feedback": "z se mide sobre la posición de las líneas, no sobre el brillo."
        }
      ]
    },
    {
      "id": 7,
      "oa": "OA2",
      "concepto": "El corrimiento al rojo cosmológico no es un Doppler ordinario",
      "etiqueta": "Interpretación del corrimiento al rojo",
      "enunciado": "En una galaxia suficientemente lejana, ¿cuál es la interpretación principal del corrimiento al rojo observado?",
      "opciones": [
        {
          "texto": "Es únicamente un Doppler ordinario debido al movimiento de la galaxia a través de un espacio estático.",
          "correcta": false,
          "feedback": "Idea errónea: no es solo un Doppler ordinario; domina la expansión cosmológica. v = c·z es un atajo válido a bajo z."
        },
        {
          "texto": "Está dominado por la expansión cosmológica; las velocidades peculiares pueden añadir una contribución local.",
          "correcta": true,
          "feedback": "Correcto: el corrimiento lo domina la expansión cosmológica; las velocidades peculiares solo añaden una contribución local (y explican parte de la dispersión del diagrama)."
        },
        {
          "texto": "La luz pierde energía por «cansancio» durante el viaje.",
          "correcta": false,
          "feedback": "La hipótesis de la «luz cansada» está descartada por las observaciones."
        }
      ]
    },
    {
      "id": 8,
      "oa": "OA3",
      "concepto": "Ley de Hubble-Lemaître: pendiente = H0",
      "etiqueta": "La ley de Hubble",
      "enunciado": "Al representar velocidad de recesión frente a distancia para muchas galaxias, ¿qué patrón se espera a bajo z y qué representa la pendiente?",
      "opciones": [
        {
          "texto": "Todas se alejan con la misma velocidad; la pendiente no tiene interpretación.",
          "correcta": false,
          "feedback": "No: la velocidad depende de la distancia."
        },
        {
          "texto": "La velocidad aumenta aproximadamente de forma lineal con la distancia y la pendiente es H₀.",
          "correcta": true,
          "feedback": "Correcto: v = H₀·d, y la pendiente del diagrama es H₀."
        },
        {
          "texto": "Las cercanas se alejan más deprisa y la pendiente es el tamaño de las galaxias.",
          "correcta": false,
          "feedback": "Es al revés (las lejanas van más rápido) y la pendiente no es un tamaño."
        }
      ]
    },
    {
      "id": 9,
      "oa": "OA3",
      "concepto": "Los sistemas ligados no se expanden",
      "etiqueta": "La expansión y las cosas cotidianas",
      "enunciado": "Si el universo se expande, ¿por qué no se expanden apreciablemente tu cuerpo, la Tierra o una galaxia ligada?",
      "opciones": [
        {
          "texto": "Sí se expanden al mismo ritmo que el universo.",
          "correcta": false,
          "feedback": "Idea errónea: los sistemas ligados no participan apreciablemente de la expansión."
        },
        {
          "texto": "A esas escalas dominan las interacciones que mantienen ligado el sistema; no siguen apreciablemente el flujo de Hubble.",
          "correcta": true,
          "feedback": "Correcto: la gravedad (u otras fuerzas) vence a la expansión; solo se separa el espacio entre galaxias no ligadas."
        },
        {
          "texto": "Porque la expansión solo ocurre a partir de una distancia fija del observador.",
          "correcta": false,
          "feedback": "La expansión ocurre en todas partes, pero las uniones locales la vencen."
        }
      ]
    },
    {
      "id": 10,
      "oa": "OA5",
      "concepto": "t_H = 1/H0 es una aproximación (extrapolación lineal)",
      "etiqueta": "¿Es exacta la edad estimada?",
      "enunciado": "La estimación t<sub>H</sub> = 1/H₀…",
      "opciones": [
        {
          "texto": "es la edad exacta y definitiva del universo;",
          "correcta": false,
          "feedback": "Idea errónea: es una escala temporal, no un valor exacto."
        },
        {
          "texto": "es el tiempo de Hubble, una escala temporal obtenida al extrapolar linealmente el ritmo actual; la edad precisa depende de la historia de expansión;",
          "correcta": true,
          "feedback": "Correcto: por eso el valor que dan los modelos (≈13 800 Ma) difiere algo de 1/H₀."
        },
        {
          "texto": "es siempre mucho mayor que la edad cosmológica;",
          "correcta": false,
          "feedback": "La diferencia es pequeña; no es «mucho mayor»."
        }
      ]
    },
    {
      "id": 11,
      "oa": "OA4",
      "concepto": "Significado de 1/H0 (escala temporal, no la edad exacta)",
      "etiqueta": "Qué significa 1/H₀",
      "enunciado": "Si calculas 1/H₀ ≈ 14 mil millones de años, ese número representa…",
      "opciones": [
        {
          "texto": "el tiempo de viaje de la luz de la galaxia más lejana;",
          "correcta": false,
          "feedback": "Eso sería d/c (tiempo de viaje de la luz), mucho menor y distinto."
        },
        {
          "texto": "el tiempo de Hubble: una escala temporal del orden de la edad del universo, no la edad exacta;",
          "correcta": true,
          "feedback": "Correcto: es una escala de tiempo (d/v), del orden de la edad del universo, no su valor exacto."
        },
        {
          "texto": "la distancia hasta un borde físico del universo;",
          "correcta": false,
          "feedback": "Es un tiempo, no una distancia; y no hay «borde»."
        }
      ]
    },
    {
      "id": 12,
      "oa": "OA4",
      "concepto": "c/H0 es el radio de Hubble, no el radio observable",
      "etiqueta": "Radio de Hubble y universo observable",
      "enunciado": "El radio de Hubble R<sub>H</sub> = c/H₀ ∼ 14 Gly…",
      "opciones": [
        {
          "texto": "es una escala característica asociada a la expansión actual y no es el radio del universo observable, cuyo valor comóvil actual es ∼46 Gly en ΛCDM;",
          "correcta": true,
          "feedback": "Correcto: c/H₀ (~14 Gly) es el radio de Hubble; el radio observable (~46 Gly) resulta de la historia de expansión."
        },
        {
          "texto": "es exactamente el radio del universo observable;",
          "correcta": false,
          "feedback": "Idea errónea: el observable (~46 Gly) es una magnitud distinta y mayor."
        },
        {
          "texto": "debe multiplicarse siempre por un factor universal de 3,3 para obtener el radio observable;",
          "correcta": false,
          "feedback": "No hay un factor fijo: ese cociente sale de la historia de la expansión del modelo."
        }
      ]
    },
    {
      "id": 13,
      "oa": "OA3",
      "concepto": "Velocidades peculiares: la dispersión del diagrama de Hubble",
      "etiqueta": "La dispersión del diagrama",
      "enunciado": "En un diagrama de Hubble algunas galaxias cercanas se apartan de la recta. ¿Cuál es la explicación más adecuada?",
      "opciones": [
        {
          "texto": "La relación de Hubble solo se cumple para algunas galaxias elegidas.",
          "correcta": false,
          "feedback": "No: la relación vale en general; a distancias pequeñas otros movimientos pesan más."
        },
        {
          "texto": "Sus velocidades peculiares pueden ser comparables con la componente debida a la expansión y aumentar la dispersión.",
          "correcta": true,
          "feedback": "Correcto: a corta distancia la recesión es pequeña y las velocidades peculiares la enmascaran."
        },
        {
          "texto": "Las distancias de cualquier punto que se aparte de la recta son necesariamente erróneas.",
          "correcta": false,
          "feedback": "No tienen por qué estar mal medidas: la dispersión se debe sobre todo a las velocidades peculiares."
        }
      ]
    },
    {
      "id": 14,
      "oa": "OA7",
      "concepto": "Naturaleza de la ciencia: magnitudes inferidas y revisables",
      "etiqueta": "Cómo lo sabe la ciencia",
      "enunciado": "¿Cuál describe mejor cómo la ciencia conoce la edad y las escalas del universo?",
      "opciones": [
        {
          "texto": "Son datos observados directamente y ya definitivos.",
          "correcta": false,
          "feedback": "Idea errónea: no se miden «directamente» ni son definitivos."
        },
        {
          "texto": "Se infieren a partir de observaciones, modelos y aproximaciones; poseen incertidumbres y pueden revisarse con nueva evidencia.",
          "correcta": true,
          "feedback": "Correcto: la ciencia infiere, aproxima y revisa (p. ej. la tensión de Hubble)."
        },
        {
          "texto": "Son estimaciones sin base observacional.",
          "correcta": false,
          "feedback": "Tienen una base observacional sólida; no son opiniones."
        }
      ]
    },
    {
      "id": 15,
      "oa": "OA3",
      "concepto": "Distancias independientes del corrimiento al rojo (no circularidad)",
      "etiqueta": "Por qué distancias independientes",
      "enunciado": "¿Por qué las distancias usadas para construir el diagrama deben obtenerse por métodos independientes del corrimiento al rojo?",
      "opciones": [
        {
          "texto": "Porque calcularlas previamente con la propia relación de Hubble introduciría circularidad: supondríamos la relación que queremos contrastar.",
          "correcta": true,
          "feedback": "Correcto: usar distancias independientes evita el razonamiento circular; así la relación v–d se descubre de verdad."
        },
        {
          "texto": "Porque una distancia independiente nunca tiene incertidumbre.",
          "correcta": false,
          "feedback": "No: también tienen incertidumbre; lo clave es que no dependen del corrimiento al rojo."
        },
        {
          "texto": "Porque el corrimiento al rojo no puede medirse observacionalmente.",
          "correcta": false,
          "feedback": "El corrimiento al rojo sí se mide directamente del espectro; la cuestión es evitar la circularidad."
        }
      ]
    }
  ]
};
