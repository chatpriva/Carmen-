/* ==========================================================================
   CG SOLUÇÕES GRÁFICAS — script.js
   JavaScript puro, sem dependências externas.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initHeaderScroll();
    initMobileMenu();
    initSmoothAnchors();
    initScrollReveal();
    initFaqAccordion();
    initToTopButton();
    initContactForm();
  }

  /* ------------------------------------------------------------------ */
  /* Ano automático no rodapé                                            */
  /* ------------------------------------------------------------------ */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ */
  /* Header: muda de estilo ao rolar a página                            */
  /* ------------------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.getElementById("header");
    if (!header) return;

    function update() {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Menu mobile (hambúrguer)                                             */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("navLinks");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Rolagem suave para âncoras internas                                  */
  /* ------------------------------------------------------------------ */
  function initSmoothAnchors() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = link.getAttribute("href");
        if (targetId.length < 2) return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 84;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Animações de revelação ao rolar (IntersectionObserver)               */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ — accordion animado                                              */
  /* ------------------------------------------------------------------ */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (!question || !answer) return;

      // estado inicial
      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
      }

      question.addEventListener("click", function () {
        var isActive = item.classList.contains("active");

        // fecha os outros itens (comportamento de accordion único)
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("active");
            var otherAnswer = other.querySelector(".faq-answer");
            if (otherAnswer) otherAnswer.style.maxHeight = "0px";
          }
        });

        if (isActive) {
          item.classList.remove("active");
          answer.style.maxHeight = "0px";
        } else {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });

    // recalcula altura do item aberto ao redimensionar a janela
    window.addEventListener("resize", function () {
      var active = document.querySelector(".faq-item.active .faq-answer");
      if (active) active.style.maxHeight = active.scrollHeight + "px";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Botão "voltar ao topo"                                               */
  /* ------------------------------------------------------------------ */
  function initToTopButton() {
    var btn = document.getElementById("toTop");
    if (!btn) return;

    function update() {
      if (window.scrollY > 500) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Formulário de contato — encaminha os dados para o WhatsApp           */
  /* ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = form.querySelector("#nome").value.trim();
      var email = form.querySelector("#email").value.trim();
      var assunto = form.querySelector("#assunto").value.trim();
      var mensagem = form.querySelector("#mensagem").value.trim();

      if (!nome || !email || !mensagem) {
        return;
      }

      var texto =
        "Olá, CG Soluções Gráficas! Meu nome é " + nome +
        ". Meu e-mail é " + email +
        (assunto ? ". Tenho interesse em: " + assunto : "") +
        ". Mensagem: " + mensagem;

      var url = "https://wa.me/5521983572897?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }

})();
