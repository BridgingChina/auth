// Populates the language-switch form's hidden `next` input with the current
// path so the POST /auth/locale handler can redirect back after flipping the
// NEXT_LOCALE cookie. Zero deps — pure browser JS.
(function () {
  var inputs = document.querySelectorAll("[data-current-path]");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = location.pathname + location.search;
  }
})();
