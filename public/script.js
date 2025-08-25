document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const btnAnterior = document.getElementById("anterior");
  const btnProximo = document.getElementById("proximo");
  const btnEnviar = document.getElementById("enviar");

  const resultadoDiv = document.getElementById("resultado");
  const mensagemSvm = document.getElementById("mensagem_svm");
  const mensagemRf = document.getElementById("mensagem_rf");

  const steps = document.querySelectorAll(".step");
  const stepCircles = document.querySelectorAll(".step-circle");


  let currentStep = 0;

  //Funcao para exibir a etapa
  function showStep(step) {
    steps.forEach((s, i) => {
      s.classList.remove("active");
      if (i === step) s.classList.add("active");
    });

    stepCircles.forEach((circle, i) => {
        circle.classList.remove("active", "completed");
        if (i < step) circle.classList.add("completed");
        if (i === step) circle.classList.add("active");
    });

    btnAnterior.disabled = step === 0;
    btnProximo.style.display = step === steps.length - 1 ? "none" : "inline-block";
    btnEnviar.style.display = step === steps.length - 1 ? "inline-block" : "none";
  }

  //Botoes de navegacao
  btnProximo.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  btnAnterior.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  //Envio
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5678/webhook/recomendar-cargo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro na requisição: " + resposta.statusText);

      const result = await response.json();

      // Exibir resultado no front
        mensagemRf.textContent = "Random Forest: " + JSON.stringify(result['random_forest'], null, 2);
        mensagemSvm.textContent = "SVM: " + JSON.stringify(result['svm'], null, 2);
        resultadoDiv.style.display = "block";

        // Marca todos os steps como concluídos
        stepCircles.forEach(c => c.classList.add("completed"));
    } catch (erro) {
        console.error("Erro ao enviar dados:", erro);
        mensagemRf.textContent = "Erro ao processar a recomendação. Tente novamente.";
        mensagemSvm.textContent = ""
        resultadoDiv.style.display = "block";
    }
  });

  showStep(currentStep);
});
