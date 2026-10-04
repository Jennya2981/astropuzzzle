(function () {
  var STORAGE_KEY = "gajd-decart-v1";

  var textareas = document.querySelectorAll(".decart-card textarea");
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch (e) {
    saved = {};
  }

  textareas.forEach(function (ta) {
    var key = ta.getAttribute("data-key");
    if (saved[key]) ta.value = saved[key];
    ta.addEventListener("input", function () {
      saved[key] = ta.value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch (e) {}
    });
  });

  document.querySelectorAll(".decart-zone").forEach(function (zone) {
    var ta = zone.querySelector("textarea");
    if (ta && ta.value) zone.classList.add("active");

    zone.addEventListener("click", function () {
      zone.classList.add("active");
      if (ta) ta.focus();
    });

    if (ta) {
      ta.addEventListener("blur", function () {
        if (!ta.value.trim()) zone.classList.remove("active");
      });
    }

    var closeBtn = zone.querySelector(".decart-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        zone.classList.remove("active");
      });
    }
  });

  var clearBtn = document.getElementById("decart-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!confirm("Очистить все ответы в квадрате Декарта?")) return;
      textareas.forEach(function (ta) {
        ta.value = "";
      });
      document.querySelectorAll(".decart-zone").forEach(function (zone) {
        zone.classList.remove("active");
      });
      saved = {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    });
  }

  document.querySelectorAll(".flip-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("flipped");
    });
  });

  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var chips = document.querySelectorAll(".chips a");

  function showStep(step, opts) {
    opts = opts || {};
    if (!step || steps.indexOf(step) === -1) return;
    steps.forEach(function (s) {
      s.classList.remove("is-active");
      s.open = false;
    });
    void document.body.offsetWidth;
    step.classList.add("is-active");
    step.open = true;
    chips.forEach(function (c) {
      c.classList.toggle("is-active", c.getAttribute("href") === "#" + step.id);
    });
    if (opts.scroll) {
      step.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (opts.hash) {
      try {
        history.replaceState(null, "", "#" + step.id);
      } catch (e) {}
    }
  }

  steps.forEach(function (step) {
    var summary = step.querySelector("summary");
    if (summary) {
      summary.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      if (target.classList.contains("step")) {
        event.preventDefault();
        showStep(target, { scroll: true, hash: true });
      } else if (target.tagName === "DIV" && target.closest(".step")) {
        event.preventDefault();
        showStep(target.closest(".step"), { hash: true });
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "textarea" || tag === "input" || event.target.isContentEditable) return;
    var active = document.querySelector(".step.is-active");
    var i = steps.indexOf(active);
    if (i === -1) return;
    if (event.key === "ArrowRight" && i < steps.length - 1) {
      showStep(steps[i + 1], { scroll: true, hash: true });
    } else if (event.key === "ArrowLeft" && i > 0) {
      showStep(steps[i - 1], { scroll: true, hash: true });
    }
  });

  var initial = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (!initial || !initial.classList.contains("step")) initial = steps[0];
  showStep(initial, { hash: false });

  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("show", window.scrollY > 500);
  });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
