/* Cosmos 5E — lógica compartida de navegación (v2)
   Por DEFECTO, modo "aplicación" (guiado): el alumnado recorre las fases
   EN ORDEN; cada fase queda bloqueada hasta completar la anterior (pulsar
   "Continuar" al final). Así no se encuentra en fases avanzadas lo que debe
   descubrir antes. El "acceso docente" (con una clave sencilla) libera la
   navegación (modo consulta): permite revisar toda la secuencia sin seguir el
   orden y sin tocar los datos del alumnado. La clave solo evita accesos
   accidentales (la app es offline).

   Progreso y modo se guardan en localStorage (persisten entre días en el
   mismo dispositivo, porque la secuencia dura varias sesiones). Todo va con
   try/catch: la página funciona aunque el almacenamiento falle o esté vacío. */
(function () {
  "use strict";

  // Orden de las páginas del recorrido (índice = posición en la secuencia).
  var ORDEN = [
    "engage.html",
    "explore-espectro.html",
    "explore-diagrama.html",
    "explain.html",
    "elaborate-tamano.html",
    "elaborate-limites.html",
    "evaluate.html"
  ];

  function base(href) {
    if (!href) return "";
    var h = href.split("#")[0].split("?")[0];
    var parts = h.split("/");
    return parts[parts.length - 1] || "index.html";
  }
  function indiceDe(href) { return ORDEN.indexOf(base(href)); }
  function paginaActual() { return base(location.pathname); }

  function lsGet(k, def) {
    try { var v = localStorage.getItem(k); return v === null ? def : v; }
    catch (e) { return def; }
  }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Modo docente = solo revisión: mientras esté activo NO se persiste ningún dato
  // (respuestas, conjetura, explicación, H0, progreso). Se bloquean las escrituras de
  // claves cosmos5e_* ---salvo el propio "cosmos5e_modo"--- para no mezclarse con los
  // datos del alumnado. removeItem/clear no se tocan: "Reiniciar" sigue funcionando.
  try {
    var _lsSetItem = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = function (k, v) {
      try {
        if (k && String(k).indexOf("cosmos5e_") === 0 && k !== "cosmos5e_modo" && getModo() === "consulta") return;
      } catch (e) {}
      return _lsSetItem(k, v);
    };
  } catch (e) {}

  // Modo por defecto = "aplicacion" (guiado). El docente puede pasar a "consulta".
  function getModo() { return lsGet("cosmos5e_modo", "aplicacion"); }
  function esGuiado() { return getModo() === "aplicacion"; }
  function getProgreso() { var n = parseInt(lsGet("cosmos5e_progreso", "0"), 10); return isNaN(n) ? 0 : n; }

  function setModo(m) { lsSet("cosmos5e_modo", m); }
  function modoDocente() { setModo("consulta"); }
  function modoAlumno() { setModo("aplicacion"); }
  function reiniciarProgreso() { lsSet("cosmos5e_progreso", "0"); }

  // Reinicio completo: borra los datos locales y vuelve a modo alumno con el progreso a 0.
  // Recarga la página actual (desde el índice, se queda en el índice ya reiniciado).
  function reiniciar() {
    try { ["cosmos5e_pre", "cosmos5e_post", "cosmos5e_conjetura", "cosmos5e_explicacion", "cosmos5e_h0", "cosmos5e_codigo"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
    lsSet("cosmos5e_modo", "aplicacion");
    lsSet("cosmos5e_progreso", "0");
    location.reload();
  }

  // Acceso al Modo docente mediante una clave sencilla (solo para evitar accesos
  // accidentales del alumnado; la app es offline). El Modo docente NO rellena
  // respuestas, NO genera datos y NO modifica el progreso: solo libera la navegación.
  var CLAVE_DOCENTE = "docente";   // clave sencilla; puede cambiarse aquí
  function accederDocente() {
    var clave;
    try { clave = window.prompt("Acceso docente\n\nIntroduce la clave para activar el Modo docente (navegación libre por todas las fases):", ""); }
    catch (e) { clave = null; }
    if (clave === null) return;                       // cancelado
    if (String(clave).trim().toLowerCase() === CLAVE_DOCENTE) {
      modoDocente();
      location.href = "index.html";
    } else {
      try { window.alert("Clave incorrecta."); } catch (e) {}
    }
  }

  // Solo en modo estudiante: el Modo docente navega libremente sin tocar el progreso guardado.
  function desbloquearHasta(idx) { if (esGuiado() && idx > getProgreso()) lsSet("cosmos5e_progreso", String(idx)); }

  // Ir a la fase que toca (la más avanzada desbloqueada). Sirve de "empezar/continuar".
  function irAActual() { location.href = ORDEN[Math.min(getProgreso(), ORDEN.length - 1)]; }

  // Avanza al destino, desbloqueándolo antes (usado por el botón "Continuar").
  function continuar(destino) {
    var idx = indiceDe(destino);
    if (idx >= 0) desbloquearHasta(idx);
    location.href = destino;
  }

  // En modo guiado, si se abre directamente una fase aún bloqueada, redirige
  // a la fase que corresponde (el candado no se salta escribiendo la URL).
  function forzarSecuencia() {
    if (!esGuiado()) return;
    var idx = indiceDe(paginaActual());
    if (idx > getProgreso()) { location.replace(ORDEN[getProgreso()]); }
  }

  // Bloquea las pastillas de navegación de la cabecera posteriores al progreso.
  function aplicarBloqueoNav() {
    if (!esGuiado()) return;
    var prog = getProgreso();
    document.querySelectorAll(".fases a[href]").forEach(function (a) {
      var idx = indiceDe(a.getAttribute("href"));
      if (idx > prog) {
        a.classList.add("bloq");                            // solo atenuada y no clicable, sin candado
        a.setAttribute("aria-disabled", "true");
        a.addEventListener("click", function (ev) { ev.preventDefault(); });
      }
    });
  }

  // Bloquea las fichas del índice (rejilla de fases) posteriores al progreso.
  function bloquearRejilla() {
    if (!esGuiado()) return;
    var prog = getProgreso();
    document.querySelectorAll(".rejilla .fase[href]").forEach(function (a) {
      var idx = indiceDe(a.getAttribute("href"));
      if (idx > prog) {
        a.classList.add("bloq");
        a.setAttribute("aria-disabled", "true");
        a.addEventListener("click", function (ev) { ev.preventDefault(); });
        var fl = a.querySelector(".flecha"); if (fl) fl.textContent = "🔒";
      }
    });
  }

  // Aviso de modo en la cabecera, con conmutador docente/alumno.
  function pintarBadgeModo() {
    if (esGuiado()) return;                         // en modo estudiante no se muestra
    if (paginaActual() === "index.html") return;    // el índice ya tiene su propio indicador
    var marca = document.querySelector("header .marca");
    if (!marca || document.getElementById("modoBadge")) return;
    var a = document.createElement("a");
    a.id = "modoBadge";
    a.href = "index.html";
    a.textContent = "Estás en modo docente, pulsa aquí para volver a modo estudiante";
    a.title = "Volver al Modo estudiante";
    a.addEventListener("click", function (ev) { ev.preventDefault(); modoAlumno(); location.href = "index.html"; });
    marca.insertAdjacentElement("afterend", a);
  }

  // En el índice: muestra el estado del modo y los accesos (estudiante / docente).
  function pintarAccesoModos(containerId) {
    var cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = "";
    function boton(txt, fn) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "btn-mapa"; b.textContent = txt;
      b.addEventListener("click", fn);
      return b;
    }
    var reset = boton("↻ Reiniciar la secuencia", function () {
      if (window.confirm("¿Reiniciar la secuencia? Se borrarán el progreso y las respuestas guardadas en este dispositivo, y solo quedará disponible la fase 1 (Engage).")) reiniciar();
    });
    var info = document.createElement("p"); info.className = "modo-info";
    var expl = document.createElement("p"); expl.className = "modo-expl";
    if (esGuiado()) {
      info.innerHTML = "Estás en <b>Modo estudiante</b>.";
      expl.innerHTML = "Las fases se recorren <b>en orden</b> (Engage → Explore → Explain → Elaborate → Evaluate).<br>Cada una se <b>desbloquea al completar la anterior</b> para no adelantar lo que debes descubrir por ti mismo.";
      cont.appendChild(info); cont.appendChild(expl);
      cont.appendChild(boton("🔒 Modo docente", accederDocente));
      cont.appendChild(reset);
    } else {
      info.innerHTML = "Estás en <b>Modo docente</b>.";
      expl.innerHTML = "Navegación libre por todas las fases para revisar la secuencia completa.<br><b>No se modifica la información guardada en Modo estudiante.</b>";
      cont.appendChild(info); cont.appendChild(expl);
      cont.appendChild(boton("↩ Volver al Modo estudiante", function () { modoAlumno(); location.href = "index.html"; }));
      cont.appendChild(reset);
    }
  }

  function inyectarEstilos() {
    if (document.getElementById("cosmosNavCss")) return;
    var s = document.createElement("style"); s.id = "cosmosNavCss";
    s.textContent =
      ".fases a,.fases span{padding-top:3px;padding-bottom:3px;line-height:1.1;}" +
      ".fases a.bloq{opacity:.45;cursor:not-allowed;}" +
      ".fases a.bloq:hover{background:rgba(255,255,255,.16);}" +
      ".rejilla .fase.bloq{opacity:.5;cursor:not-allowed;filter:grayscale(.4);}" +
      ".rejilla .fase.bloq:hover{transform:none;box-shadow:0 1px 3px rgba(0,0,0,.04);}" +
      "#modoBadge{margin-left:12px;margin-right:auto;align-self:center;background:var(--naranja-suave,#fbe9e0);color:var(--naranja,#E65113);padding:6px 14px;border-radius:8px;font-size:.74rem;font-weight:700;text-decoration:none;white-space:nowrap;cursor:pointer;}" +
      "#modoBadge:hover{filter:brightness(.96);}" +
      ".modo-info{width:100%;flex-basis:100%;text-align:center;color:var(--negro,#1a1a1a);font-size:.95rem;margin:0 0 4px;}" +
      ".modo-expl{width:100%;flex-basis:100%;text-align:center;color:var(--gris,#6b6b6b);font-size:.88rem;line-height:1.45;margin:0 0 12px;}" +
      ".cta-continuar{display:inline-flex;align-items:center;gap:8px;background:var(--naranja,#E65113);color:#fff;" +
      "text-decoration:none;font-weight:700;border:none;cursor:pointer;font-size:1rem;padding:12px 20px;border-radius:10px;margin-top:6px;}" +
      ".cta-continuar:hover{filter:brightness(1.06);}" +
      ".cta-wrap{text-align:center;margin:22px 0 4px;}";
    document.head.appendChild(s);
  }

  // Botón "Continuar" al final de una página (avanza y desbloquea la siguiente).
  function pintarContinuar(containerId, destino, etiqueta) {
    var cont = document.getElementById(containerId);
    if (!cont) return;
    var a = document.createElement("a");
    a.className = "cta-continuar";
    a.href = destino;
    a.innerHTML = (etiqueta || "Continuar") + " →";
    a.addEventListener("click", function (ev) { ev.preventDefault(); continuar(destino); });
    var wrap = document.createElement("div"); wrap.className = "cta-wrap";
    wrap.appendChild(a); cont.appendChild(wrap);
  }

  // forzarSecuencia debe ejecutarse cuanto antes (antes de pintar la página).
  forzarSecuencia();

  // Al abrir un apartado colapsable (details.seccion), avisar con un "resize" para que
  // los interactivos que miden su tamaño al dibujarse (p. ej. el canvas de Olbers) se
  // re-rendericen con el ancho real. Los SVG con viewBox no lo necesitan (escalan solos).
  document.addEventListener("toggle", function (ev) {
    var d = ev.target;
    if (d && d.classList && d.classList.contains("seccion") && d.open) {
      try { window.dispatchEvent(new Event("resize")); } catch (e) {}
    }
  }, true);

  function init() {
    inyectarEstilos();
    aplicarBloqueoNav();
    bloquearRejilla();
    pintarBadgeModo();
    pintarAccesoModos("accesoModos");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Cosmos = {
    getModo: getModo, esGuiado: esGuiado, setModo: setModo,
    modoDocente: modoDocente, modoAlumno: modoAlumno,
    getProgreso: getProgreso, reiniciarProgreso: reiniciarProgreso, reiniciar: reiniciar,
    accederDocente: accederDocente, pintarAccesoModos: pintarAccesoModos,
    desbloquearHasta: desbloquearHasta, continuar: continuar,
    irAActual: irAActual, pintarContinuar: pintarContinuar,
    indiceDe: indiceDe, ORDEN: ORDEN
  };
})();
