# Memoria del TFM

Trabajo de Fin de Máster **«Secuencia Didáctica 5E para la Determinación de la Edad y el Tamaño del Universo»** — Máster Universitario en Astronomía y Astrofísica (VIU). **Alumno:** Javier Piay Pombo · **Director:** Ricardo García Salcedo · 2026.

## Leer la memoria

- **PDF:** [`TFM_VIU_PIAY_v2.pdf`](TFM_VIU_PIAY_v2.pdf) — documento completo (87 páginas).

## Fuentes LaTeX

Los fuentes están en [`latex/`](latex/):

```
latex/
├── TFM_VIU_PIAY_v2.tex              ← archivo principal
├── Bibliografia_TFM_VIU_PIAY.bib
├── capitulos/                       ← cap1–5 y anexos
└── Images/                          ← figuras y capturas de la web
```

### Compilar

El proyecto usa **XeLaTeX** (el archivo principal ya incluye `% !TeX program = xelatex`) y **biber** para la bibliografía:

```
xelatex TFM_VIU_PIAY_v2
biber   TFM_VIU_PIAY_v2
xelatex TFM_VIU_PIAY_v2
xelatex TFM_VIU_PIAY_v2
```

### Abrir en Overleaf

1. Descarga la carpeta `latex/` como ZIP.
2. En Overleaf: **New Project → Upload Project** y sube el ZIP.
3. Overleaf detecta XeLaTeX automáticamente (por el comentario `% !TeX program = xelatex`). La fuente (TeX Gyre Heros) y todos los paquetes vienen de serie, así que compila sin configurar nada.
