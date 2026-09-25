/* Cosmos 5E — cuestionario conceptual adaptativo (v2)
   Un mismo instrumento para el pre (Engage) y el post (Evaluate).
   Mecánica (idea del autor): para cada concepto el alumno declara su
   familiaridad; SOLO si dice "creo que podría explicarlo" se le muestra
   la pregunta para que lo demuestre. En Engage NO se corrige (no adelantar);
   en Evaluate se corrige y se compara con el pre.
   Medida comparable (0..N): nº de conceptos que el alumno afirma dominar Y
   responde correctamente. Mismo instrumento pre/post → cambio conceptual.
   Datos: window.TEST_CONCEPTUAL. Almacenamiento best-effort en localStorage
   (solo para el contraste pre→post); todo con try/catch. */
(function () {
  "use strict";

  var FAM = ["No me suena", "Me suena, pero no sabría explicarlo", "Creo que podría explicarlo"];
  var NIVEL_RETO = 2; // índice que dispara la pregunta

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
      ".dg-eti{font-weight:800;color:var(--negro,#1a1a1a);margin:0 0 8px;}" +
      ".dg-eti .dg-n{color:var(--naranja,#E65113);margin-right:6px;}" +
      ".dg-fam{display:flex;flex-direction:column;gap:6px;}" +
      ".dg-fam label{display:flex;gap:9px;align-items:center;padding:7px 10px;border:1px solid var(--gris-claro,#e9e9e9);border-radius:8px;cursor:pointer;font-size:.92rem;}" +
      ".dg-fam label:hover{background:var(--naranja-suave,#fbe9e0);}" +
      ".dg-fam input{accent-color:var(--naranja,#E65113);}" +
      ".dg-q{margin:12px 0 2px;padding:12px 14px;border-left:4px solid var(--naranja,#E65113);background:var(--naranja-suave,#fbe9e0);border-radius:0 8px 8px 0;}" +
      ".dg-q .dg-reto{font-weight:700;color:var(--naranja,#E65113);margin:0 0 8px;font-size:.9rem;}" +
      ".dg-q .dg-enun{font-weight:700;margin:0 0 8px;}" +
      ".qz-opt{display:flex;gap:10px;align-items:flex-start;padding:9px 11px;border:1px solid var(--gris-claro,#e9e9e9);border-radius:8px;margin:6px 0;cursor:pointer;font-size:.94rem;background:#fff;}" +
      ".qz-opt:hover{background:#fff7f2;}" +
      ".qz-opt input{margin-top:3px;accent-color:var(--naranja,#E65113);}" +
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

  // Diagnóstico adaptativo. mode: "pre" | "post".
  function renderDiagnostico(containerId, mode) {
    inyectarEstilos();
    var cont = document.getElementById(containerId);
    if (!cont) return;
    var data = window.TEST_CONCEPTUAL;
    if (!data || !data.items) { cont.innerHTML = "<p>No se han podido cargar los conceptos.</p>"; return; }
    var items = data.items;
    var orden = items.map(function (it) { return baraja(it.opciones.length); });

    var html = "";
    items.forEach(function (it, i) {
      html += '<div class="dg-item">';
      html += '<p class="dg-eti"><span class="dg-n">' + (i + 1) + '.</span>' + (it.etiqueta || it.concepto) + "</p>";
      html += '<div class="dg-fam">';
      FAM.forEach(function (f, k) {
        html += '<label><input type="radio" name="fam' + i + '" value="' + k + '"> ' + f + "</label>";
      });
      html += "</div>";
      // Bloque de pregunta (oculto hasta que se declare "podría explicarlo").
      html += '<div class="dg-q" id="q' + i + '" hidden>';
      html += '<p class="dg-reto">Responde esta pregunta, por favor. Al final de la secuencia podrás hacerlo de nuevo y comparar tus respuestas.</p>';
      html += '<p class="dg-enun">' + it.enunciado + "</p>";
      orden[i].forEach(function (oIdx) {
        var op = it.opciones[oIdx];
        html += '<label class="qz-opt" data-i="' + i + '" data-o="' + oIdx + '">' +
          '<input type="radio" name="q' + i + '" value="' + oIdx + '">' +
          "<span>" + op.texto + '<span class="fb" hidden></span></span></label>';
      });
      html += "</div></div>";
    });

    var btnTxt = mode === "post" ? "Comprobar mis respuestas" : "Enviar mis respuestas";
    html += '<button type="button" class="qz-send" id="qzSend">' + btnTxt + "</button>";
    html += '<div id="qzRes"></div>';
    cont.innerHTML = html;

    // Mostrar/ocultar la pregunta según la familiaridad declarada.
    items.forEach(function (it, i) {
      var q = document.getElementById("q" + i);
      cont.querySelectorAll('input[name="fam' + i + '"]').forEach(function (r) {
        r.addEventListener("change", function () {
          if (parseInt(r.value, 10) === NIVEL_RETO) { q.hidden = false; }
          else { q.hidden = true; q.querySelectorAll('input[name="q' + i + '"]').forEach(function (x) { x.checked = false; }); }
        });
      });
    });

    // Restaurar respuestas previas (si las hay), para verlas al volver, como en las otras fases.
    (function restaurar() {
      var key = (mode === "post") ? "cosmos5e_post" : "cosmos5e_pre";
      var sv = null; try { sv = JSON.parse(lsGet(key) || "null"); } catch (e) {}
      if (!sv || !sv.detalle || sv.detalle.length !== items.length) return;
      items.forEach(function (it, i) {
        var d = sv.detalle[i]; if (!d) return;
        if (d.fam >= 0) {
          var fr = cont.querySelector('input[name="fam' + i + '"][value="' + d.fam + '"]');
          if (fr) { fr.checked = true; if (d.fam === NIVEL_RETO) { var q = document.getElementById("q" + i); if (q) q.hidden = false; } }
        }
        if (d.ans >= 0) {
          var ar = cont.querySelector('input[name="q' + i + '"][value="' + d.ans + '"]');
          if (ar) ar.checked = true;
        }
      });
      var aviso = document.createElement("div"); aviso.className = "qz-res";
      aviso.innerHTML = "<b>Recuperadas tus respuestas.</b> Puedes revisarlas o cambiarlas y volver a " +
        (mode === "post" ? "comprobar." : "enviar.");
      cont.insertBefore(aviso, cont.firstChild);
    })();

    document.getElementById("qzSend").addEventListener("click", function () {
      var dgItems = cont.querySelectorAll(".dg-item");
      dgItems.forEach(function (el) { el.classList.remove("falta"); });
      var detalle = [], claimed = 0, score = 0, retoSinResp = 0, famSinResp = 0, primerFallo = null;
      items.forEach(function (it, i) {
        var famSel = cont.querySelector('input[name="fam' + i + '"]:checked');
        var fam = famSel ? parseInt(famSel.value, 10) : -1;
        var ans = -1, correct = false, falta = false;
        if (fam < 0) { famSinResp++; falta = true; }
        else if (fam === NIVEL_RETO) {
          claimed++;
          var aSel = cont.querySelector('input[name="q' + i + '"]:checked');
          ans = aSel ? parseInt(aSel.value, 10) : -1;
          if (ans < 0) { retoSinResp++; falta = true; }
          else { correct = !!it.opciones[ans].correcta; if (correct) score++; }
        }
        if (falta && dgItems[i]) { dgItems[i].classList.add("falta"); if (!primerFallo) primerFallo = dgItems[i]; }
        detalle.push({ fam: fam, ans: ans, correct: correct });
      });

      var res = document.getElementById("qzRes");

      // No se guarda nada si queda algo a la vista sin responder.
      if (famSinResp > 0 || retoSinResp > 0) {
        var partes = [];
        if (famSinResp > 0) partes.push("indica tu familiaridad en <b>" + famSinResp + "</b> concepto(s)");
        if (retoSinResp > 0) partes.push("responde la pregunta de <b>" + retoSinResp + "</b> concepto(s) que dijiste poder explicar");
        res.innerHTML = '<div class="qz-res falta-msg"><b>Aún no se ha guardado nada.</b> Para continuar, ' +
          partes.join(" y ") + ". (Lo que falta está marcado en rojo.)</div>";
        if (primerFallo) primerFallo.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (mode === "pre") {
        lsSet("cosmos5e_pre", JSON.stringify({ n: items.length, claimed: claimed, score: score, detalle: detalle, fecha: Date.now() }));
        res.innerHTML = '<div class="qz-res"><b>¡Registrado!</b> Dijiste que podrías explicar <b>' + claimed + " de " + items.length +
          "</b> conceptos. No te decimos aún si acertaste: de eso trata la secuencia. Al final, en <b>Evaluate</b>, " +
          "volverás a esta lista y verás cuánto has avanzado." +
          '<p class="qz-aviso">Se guarda una copia en este dispositivo solo para comparar tu antes y tu después. ' +
          "El registro para el estudio lo recoge tu docente.</p></div>";
        document.getElementById("qzSend").disabled = true;
        cont.querySelectorAll("input").forEach(function (x) { x.disabled = true; });
        return;
      }

      // mode === "post": corregir las preguntas contestadas y comparar con el pre.
      try { lsSet("cosmos5e_post", JSON.stringify({ n: items.length, claimed: claimed, score: score, detalle: detalle, fecha: Date.now() })); } catch (e) {}
      items.forEach(function (it, i) {
        var d = detalle[i];
        if (d.fam !== NIVEL_RETO) return;
        cont.querySelectorAll('.qz-opt[data-i="' + i + '"]').forEach(function (lab) {
          var oIdx = parseInt(lab.getAttribute("data-o"), 10);
          var op = it.opciones[oIdx];
          var fb = lab.querySelector(".fb");
          var inp = lab.querySelector("input"); if (inp) inp.disabled = true;
          if (op.correcta) { lab.classList.add("ok"); fb.hidden = false; fb.textContent = op.feedback; }
          else if (oIdx === d.ans) { lab.classList.add("ko"); fb.hidden = false; fb.textContent = op.feedback; }
        });
      });

      var msg = '<div class="qz-res"><b>Ahora dices poder explicar ' + claimed + " de " + items.length +
        "</b> conceptos, y de esos has demostrado <b>" + score + "</b> correctamente.";
      var pre = null; try { pre = JSON.parse(lsGet("cosmos5e_pre") || "null"); } catch (e) {}
      if (pre && typeof pre.claimed === "number") {
        var dc = claimed - pre.claimed, ds = score - pre.score;
        msg += "<br>Al empezar (Engage) decías poder explicar <b>" + pre.claimed + "</b> y demostrabas <b>" + pre.score + "</b>. " +
          "Tu avance: <b>" + (dc >= 0 ? "+" : "") + dc + "</b> en confianza y <b>" + (ds >= 0 ? "+" : "") + ds + "</b> en aciertos demostrados.";
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
