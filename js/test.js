/* Cosmos 5E — cuestionario conceptual (v2)
   Un mismo instrumento para el pre (Engage) y el post (Evaluate): para cada
   concepto se responde SIEMPRE su pregunta, con una opción "No lo sé / no
   estoy seguro" para quien no lo tenga claro (así siempre hay pretest). En
   Engage NO se corrige (no adelantar); en Evaluate se corrige y se compara.
   Medida comparable (0..N): nº de aciertos. Mismo instrumento pre/post →
   cambio conceptual. Almacenamiento best-effort en localStorage (try/catch). */
(function () {
  "use strict";

  var NS = "ns"; // valor de "No lo sé / no estoy seguro"

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function baraja(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; }
    return a;
  }

  function inyectarEstilos() {
    if (document.getElementById("cosmosTestCss")) return;
    var s = document.createElement("style"); s.id = "cosmosTestCss";
    s.textContent =
      ".dg-item{border:1px solid var(--gris-claro,#e9e9e9);border-radius:10px;padding:14px 16px;margin:12px 0;background:#fff;}" +
      ".dg-eti{font-weight:700;color:var(--negro,#1a1a1a);margin:0 0 8px;}" +
      ".dg-eti .dg-n{color:var(--naranja,#E65113);margin-right:6px;font-weight:800;}" +
      ".dg-opts{display:flex;flex-direction:column;gap:6px;}" +
      ".qz-opt{display:flex;gap:10px;align-items:flex-start;padding:8px 11px;border:1px solid var(--gris-claro,#e9e9e9);border-radius:8px;cursor:pointer;font-size:.93rem;background:#fff;}" +
      ".qz-opt:hover{background:#fff7f2;}" +
      ".qz-opt input{margin-top:3px;accent-color:var(--naranja,#E65113);}" +
      ".qz-opt.qz-ns{font-style:italic;color:var(--gris,#6b6b6b);}" +
      ".qz-opt.ok{border-color:#2e8b57;background:#eaf6ef;}" +
      ".qz-opt.ko{border-color:#b23b3b;background:#f7ecec;}" +
      ".qz-opt .fb{display:block;font-size:.85rem;color:var(--gris,#6b6b6b);margin-top:5px;}" +
      ".qz-opt.ok .fb{color:#256b43;}.qz-opt.ko .fb{color:#8f2f2f;}" +
      ".qz-send{background:var(--naranja,#E65113);color:#fff;border:none;cursor:pointer;font-weight:700;font-size:1rem;padding:12px 22px;border-radius:10px;margin:8px 0;}" +
      ".qz-send:hover{filter:brightness(1.06);}" +
      ".qz-res{border-left:4px solid var(--naranja,#E65113);background:var(--naranja-suave,#fbe9e0);border-radius:0 8px 8px 0;padding:12px 16px;margin:14px 0;}" +
      ".qz-res b{color:var(--naranja,#E65113);}" +
      ".qz-res.falta-msg{border-color:#b23b3b;background:#f7ecec;}.qz-res.falta-msg b{color:#b23b3b;}" +
      ".dg-item.falta{border-color:#b23b3b;box-shadow:0 0 0 2px rgba(178,59,59,.15);}" +
      ".qz-aviso{font-size:.86rem;color:var(--gris,#6b6b6b);margin-top:8px;}";
    document.head.appendChild(s);
  }

  // Cuestionario conceptual. mode: "pre" | "post".
  function renderDiagnostico(containerId, mode, onDone) {
    inyectarEstilos();
    var cont = document.getElementById(containerId);
    if (!cont) return;
    var data = window.TEST_CONCEPTUAL;
    if (!data || !data.items) { cont.innerHTML = "<p>No se han podido cargar las preguntas.</p>"; return; }
    var items = data.items;
    var orden = items.map(function (it) { return baraja(it.opciones.length); });

    var html = "";
    items.forEach(function (it, i) {
      html += '<div class="dg-item">';
      html += '<p class="dg-eti"><span class="dg-n">' + (i + 1) + '.</span>' + it.enunciado + "</p>";
      html += '<div class="dg-opts">';
      orden[i].forEach(function (oIdx) {
        var op = it.opciones[oIdx];
        html += '<label class="qz-opt" data-i="' + i + '" data-o="' + oIdx + '">' +
          '<input type="radio" name="q' + i + '" value="' + oIdx + '">' +
          "<span>" + op.texto + '<span class="fb" hidden></span></span></label>';
      });
      html += '<label class="qz-opt qz-ns" data-i="' + i + '" data-o="ns">' +
        '<input type="radio" name="q' + i + '" value="' + NS + '">' +
        "<span>No lo sé / no lo tengo claro</span></label>";
      html += "</div></div>";
    });

    var btnTxt = mode === "post" ? "Comprobar mis respuestas" : "Enviar mis respuestas";
    html += '<button type="button" class="qz-send" id="qzSend">' + btnTxt + "</button>";
    html += '<div id="qzRes"></div>';
    cont.innerHTML = html;

    // Restaurar respuestas previas (si las hay), para verlas al volver.
    (function restaurar() {
      var key = (mode === "post") ? "cosmos5e_post" : "cosmos5e_pre";
      var sv = null; try { sv = JSON.parse(lsGet(key) || "null"); } catch (e) {}
      if (!sv || !sv.detalle || sv.detalle.length !== items.length) return;
      items.forEach(function (it, i) {
        var d = sv.detalle[i]; if (!d) return;
        if (d.ans !== undefined && d.ans !== null && d.ans !== -1) {
          var ar = cont.querySelector('input[name="q' + i + '"][value="' + d.ans + '"]');
          if (ar) ar.checked = true;
        }
      });
      var aviso = document.createElement("div"); aviso.className = "qz-res";
      aviso.innerHTML = "<b>Recuperadas tus respuestas.</b> Puedes revisarlas o cambiarlas y volver a " +
        (mode === "post" ? "comprobar." : "enviar.");
      cont.insertBefore(aviso, cont.firstChild);
      if (typeof onDone === "function") onDone();
    })();

    document.getElementById("qzSend").addEventListener("click", function () {
      var dgItems = cont.querySelectorAll(".dg-item");
      dgItems.forEach(function (el) { el.classList.remove("falta"); });
      var detalle = [], score = 0, sinResp = 0, primerFallo = null;
      items.forEach(function (it, i) {
        var sel = cont.querySelector('input[name="q' + i + '"]:checked');
        var ans = -1, correct = false;
        if (!sel) { sinResp++; if (dgItems[i]) { dgItems[i].classList.add("falta"); if (!primerFallo) primerFallo = dgItems[i]; } }
        else if (sel.value === NS) { ans = NS; }
        else { ans = parseInt(sel.value, 10); correct = !!it.opciones[ans].correcta; if (correct) score++; }
        detalle.push({ ans: ans, correct: correct });
      });

      var res = document.getElementById("qzRes");

      // No se guarda nada si queda alguna sin responder.
      if (sinResp > 0) {
        res.innerHTML = '<div class="qz-res falta-msg"><b>Aún no se ha guardado nada.</b> Responde las <b>' + sinResp +
          "</b> pregunta(s) que faltan (marcadas en rojo). Si no lo tienes claro, marca «No lo sé / no lo tengo claro».</div>";
        if (primerFallo) primerFallo.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (mode === "pre") {
        lsSet("cosmos5e_pre", JSON.stringify({ n: items.length, score: score, detalle: detalle, fecha: Date.now() }));
        res.innerHTML = '<div class="qz-res"><b>¡Registrado!</b> Has respondido las ' + items.length +
          " preguntas. No te decimos aún si acertaste: de eso trata la secuencia. Al final, en <b>Evaluate</b>, " +
          "volverás a estas preguntas y verás cuánto has avanzado." +
          '<p class="qz-aviso">Se guarda una copia en este dispositivo solo para comparar tu antes y tu después. ' +
          "El registro para el estudio lo recoge tu docente.</p></div>";
        document.getElementById("qzSend").disabled = true;
        cont.querySelectorAll("input").forEach(function (x) { x.disabled = true; });
        if (typeof onDone === "function") onDone();
        return;
      }

      // mode === "post": corregir todas las preguntas y comparar con el pre.
      try { lsSet("cosmos5e_post", JSON.stringify({ n: items.length, score: score, detalle: detalle, fecha: Date.now() })); } catch (e) {}
      items.forEach(function (it, i) {
        var d = detalle[i];
        cont.querySelectorAll('.qz-opt[data-i="' + i + '"]').forEach(function (lab) {
          var oAttr = lab.getAttribute("data-o");
          var inp = lab.querySelector("input"); if (inp) inp.disabled = true;
          if (oAttr === "ns") return;
          var oIdx = parseInt(oAttr, 10);
          var op = it.opciones[oIdx];
          var fb = lab.querySelector(".fb");
          if (op.correcta) { lab.classList.add("ok"); fb.hidden = false; fb.textContent = op.feedback; }
          else if (oIdx === d.ans) { lab.classList.add("ko"); fb.hidden = false; fb.textContent = op.feedback; }
        });
      });

      var msg = '<div class="qz-res"><b>Has acertado ' + score + " de " + items.length + "</b> preguntas.";
      var pre = null; try { pre = JSON.parse(lsGet("cosmos5e_pre") || "null"); } catch (e) {}
      if (pre && typeof pre.score === "number") {
        var ds = score - pre.score;
        msg += "<br>Al empezar (Engage) acertabas <b>" + pre.score + "</b>. Tu avance: <b>" + (ds >= 0 ? "+" : "") + ds + "</b> aciertos.";
      } else {
        msg += '<p class="qz-aviso">No encontramos tus respuestas de Engage en este dispositivo; compara con lo que recuerdes.</p>';
      }
      msg += "</div>";
      res.innerHTML = msg;
      res.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  window.Cosmos = window.Cosmos || {};
  window.Cosmos.renderDiagnostico = renderDiagnostico;
})();
