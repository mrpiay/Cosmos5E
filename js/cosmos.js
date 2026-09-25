/* Cosmos 5E — lógica compartida de navegación (v2)
   Por DEFECTO, modo "aplicación" (guiado): el alumnado recorre las fases
   EN ORDEN; cada fase queda bloqueada hasta completar la anterior (pulsar
   "Continuar" al final). Así no se encuentra en fases avanzadas lo que debe
   descubrir antes. El "acceso docente" libera la navegación (modo consulta);
   no es una contraseña, solo un conmutador (la app es offline y abierta).

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
    try { ["cosmos5e_pre", "cosmos5e_post", "cosmos5e_conjetura", "cosmos5e_explicacion"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
    lsSet("cosmos5e_modo", "aplicacion");
    lsSet("cosmos5e_progreso", "0");
    location.reload();
  }

  function desbloquearHasta(idx) { if (idx > getProgreso()) lsSet("cosmos5e_progreso", String(idx)); }

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
        a.classList.add("bloq");
        a.setAttribute("aria-disabled", "true");
        a.addEventListener("click", function (ev) { ev.preventDefault(); });
        if (!a.querySelector(".candado")) {
          var lock = document.createElement("span");
          lock.className = "candado"; lock.textContent = " 🔒";
          lock.setAttribute("aria-label", "bloqueado");
          (a.querySelector("b") || a).appendChild(lock);   // junto al nombre, misma línea
        }
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
    if (esGuiado()) return;                         // en modo guiado (alumno) no se muestra aviso
    if (paginaActual() === "index.html") return;    // el índice tampoco lo muestra
    var header = document.querySelector("header");
    if (!header || document.getElementById("modoBadge")) return;
    var b = document.createElement("div");
    b.id = "modoBadge";
    b.innerHTML = 'Modo docente (navegación libre) · <a href="#" id="aAlumno">volver al modo alumno</a>';
    header.appendChild(b);
    var a = document.getElementById("aAlumno");
    if (a) a.addEventListener("click", function (ev) { ev.preventDefault(); modoAlumno(); location.reload(); });
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
      "#modoBadge{width:100%;flex-basis:100%;font-size:.74rem;opacity:.92;margin-top:2px;}" +
      "#modoBadge a{color:#fff;text-decoration:underline;font-weight:700;}" +
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

  function init() {
    inyectarEstilos();
    aplicarBloqueoNav();
    bloquearRejilla();
    pintarBadgeModo();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Cosmos = {
    getModo: getModo, esGuiado: esGuiado, setModo: setModo,
    modoDocente: modoDocente, modoAlumno: modoAlumno,
    getProgreso: getProgreso, reiniciarProgreso: reiniciarProgreso, reiniciar: reiniciar,
    desbloquearHasta: desbloquearHasta, continuar: continuar,
    irAActual: irAActual, pintarContinuar: pintarContinuar,
    indiceDe: indiceDe, ORDEN: ORDEN
  };
})();
