document.addEventListener("DOMContentLoaded", function () {
  // MODAL DE CRIAR CONTA
  const registerModal = document.getElementById("registerModal");
  const openRegisterModal = document.getElementById("openModal");
  const closeRegisterModal = document.getElementById("closeModal");

  if (openRegisterModal && registerModal && closeRegisterModal) {
    openRegisterModal.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "flex";
    });

    closeRegisterModal.addEventListener("click", function () {
      registerModal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === registerModal) {
        registerModal.style.display = "none";
      }
    });
  }

  // MODAL DE ESQUECI A SENHA
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const openForgotPasswordModal = document.getElementById("forgotPasswordLink");
  const closeForgotPasswordModal = document.getElementById("closeForgotPasswordModal");

  if (openForgotPasswordModal && forgotPasswordModal && closeForgotPasswordModal) {
    openForgotPasswordModal.addEventListener("click", function (e) {
      e.preventDefault();
      forgotPasswordModal.style.display = "flex";
    });

    closeForgotPasswordModal.addEventListener("click", function () {
      forgotPasswordModal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
      }
    });
  }

  // REDIRECIONAMENTO DO LOGIN
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "assets/dashboard.html";
    });
  }
});
