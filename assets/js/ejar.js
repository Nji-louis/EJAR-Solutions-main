(function () {
  "use strict";

  function showMessage(form, type, text) {
    var message = form.querySelector(".form-message");
    if (!message) {
      message = document.createElement("p");
      message.className = "form-message";
      form.appendChild(message);
    }
    message.className = "form-message " + type;
    message.textContent = text;
  }

  
  document.querySelectorAll("[data-validate-form]").forEach(function (form) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    var requiredFields = form.querySelectorAll("[required]");
    var valid = true;

    requiredFields.forEach(function (field) {

      if (!field.value.trim()) {

        valid = false;
        field.classList.add("field-error");

      } else {

        field.classList.remove("field-error");

      }

    });

    var honeypot = form.querySelector('[name="website"]');

    if (honeypot && honeypot.value) {

      showMessage(form, "error", "Your submission could not be processed.");
      return;

    }

    if (!valid) {

      showMessage(form, "error", "Please complete the required fields before submitting.");
      return;

    }

    const submitBtn = form.querySelector('button[type="submit"]');

    var originalButtonText = submitBtn ? submitBtn.innerText : "";

    if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
}

    let data;

if (form.classList.contains("newsletter-form")) {

    data = {
        email: form.querySelector('[name="email"]').value
    };

} else {

    data = {

        name: form.querySelector('[name="name"]')?.value || "",

        phone: form.querySelector('[name="phone"]')?.value || "",

        email: form.querySelector('[name="email"]')?.value || "",

        subject:
            form.querySelector('[name="service"]')?.value ||
            form.querySelector('[name="subject"]')?.value ||
            "",

        message:
            form.querySelector('[name="message"]')?.value ||
            form.querySelector('[name="details"]')?.value ||
            ""

    };

}

    try {

      let endpoint = "/messages";

if (form.classList.contains("newsletter-form")) {
    endpoint = "/newsletter";
}

      const result = await Api.publicPost(endpoint, data);

      if (result.success) {

        showMessage(
          form,
          "success",
          form.dataset.successMessage || "Your inquiry has been sent successfully."
        );

        form.reset();

      } else {

    showMessage(
        form,
        "error",
        result.message || "Failed to complete your subscription."
    );

}

    } catch (error) {

      console.error(error);

      showMessage(form, "error", "Unable to connect to the server.");

    }

   if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerText = originalButtonText;
}

  });

});




  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      var group = button.closest("[data-filter-group]");
      if (!group) return;

      group.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");

      group.querySelectorAll("[data-category]").forEach(function (card) {
        var categories = card.getAttribute("data-category").split(" ");
        card.hidden = filter !== "all" && categories.indexOf(filter) === -1;
      });
    });
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-lightbox]");
    if (!trigger) return;

    event.preventDefault();

    var overlay = document.querySelector(".lightbox-overlay");
    if (!overlay) return;

    var image = overlay.querySelector("img");
    image.src = trigger.getAttribute("data-lightbox");
    image.alt = trigger.querySelector("img") ? trigger.querySelector("img").alt : "EJAR GROUP SARL gallery preview";
    overlay.classList.add("active");
  });

  document.querySelectorAll("[data-lightbox-close]").forEach(function (close) {
    close.addEventListener("click", function () {
      close.closest(".lightbox-overlay").classList.remove("active");
    });
  });

  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.nextElementSibling.hidden = expanded;
    });
  });

  function ensureLanguageControl() {
    if (document.querySelector("[data-lang-switch]")) return;

    var wrapper = document.createElement("div");
    wrapper.className = "language-floating";
    wrapper.innerHTML = '<label for="ejar-language-switch">Language</label><select id="ejar-language-switch" data-lang-switch><option value="en">EN</option><option value="fr">FR</option></select>';
    document.body.appendChild(wrapper);
  }

  function setTranslateCookie(language) {
    var value = language === "fr" ? "/en/fr" : "/en/en";
    var expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    var baseCookie = "googtrans=" + value + "; " + expires + "; path=/; SameSite=Lax";
    document.cookie = baseCookie;

    /* A domain cookie lets Google Translate retain the preference between pages.
       Browsers reject this form for localhost and IP addresses, so skip it there. */
    var host = window.location.hostname;
    if (host && host !== "localhost" && host.indexOf(":") === -1 && !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
      document.cookie = baseCookie + "; domain=" + host;
    }
  }

  function getGoogleLanguageSelect() {
    return document.querySelector(".goog-te-combo");
  }

  function applyGoogleLanguage(language) {
    var googleSelect = getGoogleLanguageSelect();
    if (!googleSelect) return false;

    if (googleSelect.value !== language) {
      googleSelect.value = language;
      googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  function loadGoogleTranslate() {
    if (document.querySelector("#google_translate_element")) return Promise.resolve();

    var container = document.createElement("div");
    container.id = "google_translate_element";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);

    return new Promise(function (resolve) {
      window.googleTranslateElementInit = function () {
        if (!window.google || !window.google.translate) {
          resolve();
          return;
        }
        new window.google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: "en,fr",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, "google_translate_element");

        /* Google adds its select asynchronously after this callback. */
        var attempts = 0;
        var waitForSelect = window.setInterval(function () {
          attempts += 1;
          if (getGoogleLanguageSelect() || attempts >= 40) {
            window.clearInterval(waitForSelect);
            resolve();
          }
        }, 100);
      };

      var script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = function () { resolve(); };
      document.head.appendChild(script);
    });
  }

  function syncLanguageControls(language) {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-lang-switch]").forEach(function (switcher) {
      switcher.value = language;
    });
  }

  ensureLanguageControl();

  var savedLanguage = localStorage.getItem("ejar-language") || "en";
  syncLanguageControls(savedLanguage);
  setTranslateCookie(savedLanguage);
  var translateReady = loadGoogleTranslate();

  translateReady.then(function () {
    applyGoogleLanguage(localStorage.getItem("ejar-language") || "en");
  });

  document.querySelectorAll("[data-lang-switch]").forEach(function (switcher) {
    switcher.addEventListener("change", function () {
      var language = switcher.value;
      localStorage.setItem("ejar-language", language);
      syncLanguageControls(language);
      setTranslateCookie(language);
      translateReady.then(function () {
        /* Use Google's own control instead of a forced reload. This makes the
           change immediate and also lets the user switch back to English. */
        applyGoogleLanguage(language);
      });
    });
  });
})();

/* Public-site enhancement layer. It is deliberately presentation-only: API
   requests, form submission and existing sliders continue to be owned by the
   page scripts that already implement them. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObserver = !reduceMotion && "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 })
    : null;

  function prepareNode(node) {
    if (!node || node.nodeType !== 1) return;

    var revealTargets = [];
    if (node.matches && node.matches("section, .page-shell, .service-item, .gallery-card, .testimonial-card, .blog-card, .faq-item, #whySection .card")) {
      revealTargets.push(node);
    }
    if (node.querySelectorAll) {
      revealTargets = revealTargets.concat(Array.prototype.slice.call(node.querySelectorAll("section, .page-shell, .service-item, .gallery-card, .testimonial-card, .blog-card, .faq-item, #whySection .card")));
    }
    revealTargets.forEach(function (target) {
      if (target.dataset.revealReady) return;
      target.dataset.revealReady = "true";
      target.setAttribute("data-reveal", "");
      if (revealObserver) revealObserver.observe(target);
      else target.classList.add("is-visible");
    });

    var questions = node.matches && node.matches(".faq-question") ? [node] : [];
    if (node.querySelectorAll) questions = questions.concat(Array.prototype.slice.call(node.querySelectorAll(".faq-question")));
    questions.forEach(function (question) {
      if (question.dataset.keyboardReady) return;
      question.dataset.keyboardReady = "true";
      question.setAttribute("role", "button");
      question.setAttribute("tabindex", "0");
      question.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        question.click();
      });
    });

    var external = node.matches && node.matches('a[target="_blank"]') ? [node] : [];
    if (node.querySelectorAll) external = external.concat(Array.prototype.slice.call(node.querySelectorAll('a[target="_blank"]')));
    external.forEach(function (link) {
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function prepareDocument() { prepareNode(document.body); }

  document.addEventListener("DOMContentLoaded", function () {
    prepareDocument();

    if ("MutationObserver" in window) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(prepareNode);
        });
      }).observe(document.body, { childList: true, subtree: true });
    }

    var lastLightboxTrigger = null;
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest && event.target.closest("[data-lightbox]");
      if (trigger) lastLightboxTrigger = trigger;
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      var overlay = document.querySelector(".lightbox-overlay.active");
      if (!overlay) return;
      overlay.classList.remove("active");
      if (lastLightboxTrigger) lastLightboxTrigger.focus();
    });
  });
})();

