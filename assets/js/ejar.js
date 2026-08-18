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

        showMessage(form, "error", "Failed to send your inquiry.");

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
    image.alt = trigger.querySelector("img") ? trigger.querySelector("img").alt : "EJAR SOLUTIONS gallery preview";
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
    document.cookie = "googtrans=" + value + "; " + expires + "; path=/";
    document.cookie = "googtrans=" + value + "; " + expires + "; path=/; domain=" + window.location.hostname;
  }

  function loadGoogleTranslate() {
    if (document.querySelector("#google_translate_element")) return;

    var container = document.createElement("div");
    container.id = "google_translate_element";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);

    window.googleTranslateElementInit = function () {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,fr",
        autoDisplay: false
      }, "google_translate_element");
    };

    var script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
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
  loadGoogleTranslate();

  document.querySelectorAll("[data-lang-switch]").forEach(function (switcher) {
    switcher.addEventListener("change", function () {
      var language = switcher.value;
      localStorage.setItem("ejar-language", language);
      syncLanguageControls(language);
      setTranslateCookie(language);
      window.location.reload();
    });
  });
})();

