document.addEventListener("DOMContentLoaded", function() {
  // Atualizar o círculo de progresso
  updateStorageProgress(21); // 21% de armazenamento usado
  
  // Configurar a busca
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("focus", function() {
      this.parentElement.classList.add("focused");
    });
    
    searchInput.addEventListener("blur", function() {
      this.parentElement.classList.remove("focused");
    });
  }
});

// Função para atualizar o progresso de armazenamento
function updateStorageProgress(percent) {
  const progressCircle = document.querySelector(".progress-circle .progress");
  const progressText = document.querySelector(".progress-text");
  
  if (progressCircle && progressText) {
    // Calcular o valor do stroke-dashoffset
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    // Atualizar o círculo de progresso
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = offset;
    
    // Atualizar o texto de progresso
    progressText.textContent = `${percent}%`;
  }
}