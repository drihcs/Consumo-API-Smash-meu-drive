document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");
  
    // Tema inicial: escuro
    const currentTheme = localStorage.getItem("theme") || "dark";
    body.classList.add(currentTheme);
  
    // Mostrar ícone de acordo com o tema atual
    if (currentTheme === "dark") {
      sunIcon.style.display = "inline-block"; // mostra o sol no tema escuro
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block"; // mostra a lua no tema claro
    }
  
    themeToggle.addEventListener("click", () => {
      const isDarkNow = body.classList.toggle("light"); // ativa ou desativa a classe light
      body.classList.toggle("dark", !isDarkNow); // mantém dark se não for light
  
      // Salva o tema atualizado
      localStorage.setItem("theme", isDarkNow ? "light" : "dark");
  
      // Troca os ícones
      if (isDarkNow) {
        sunIcon.style.display = "none";       // no tema claro, sol some
        moonIcon.style.display = "inline-block"; // lua aparece
      } else {
        sunIcon.style.display = "inline-block"; // no tema escuro, sol aparece
        moonIcon.style.display = "none";       // lua some
      }
    });
  });