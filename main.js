/* Aladdin's Castle — mobile nav + contact mailto helper */
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var label = toggle ? toggle.querySelector(".nav-toggle-label") : null;

  if (toggle && nav) {
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Close" : "Menu";
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 901px)").matches) setOpen(false);
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = (form.querySelector("#name") || {}).value || "";
    var email = (form.querySelector("#email") || {}).value || "";
    var phone = (form.querySelector("#phone") || {}).value || "";
    var interest = (form.querySelector("#interest") || {}).value || "";
    var message = (form.querySelector("#message") || {}).value || "";

    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    message = message.trim();

    if (!name || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }

    var subject = "Website inquiry: " + interest;
    var body =
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + (phone || "(not provided)") + "\n" +
      "Interest: " + interest + "\n\n" +
      message;

    var mailto =
      "mailto:aladdinscastle@aol.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
  });
})();
