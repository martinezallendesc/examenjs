console.info("Hola");
// 1. Identificar los elementos del DOM
const inputCLP = document.getElementById("input-pesochileno");
const resultado = document.getElementById("resultado-visible");
const selectMoneda = document.getElementById("select-moneda");
const grafico = document.getElementById("grafico");

let chart = null;

const baseUrl = "https://mindicador.cl/api/";

async function convertir(monto, moneda) {
  return fetch(baseUrl + moneda).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error obteniendo información");
    }
  });
}

function actualizarValor(valor) {
  resultado.classList.remove("hidden");
  resultado.querySelector("span").textContent = valor;
}

function mostrarGrafico(moneda, serie) {
  grafico.classList.remove("hidden");

  const ctx = document.getElementById("historialConversion");

  const subSerie = serie.splice(0, 10);
  const labels = subSerie.map((s) => s.fecha.split("T")[0]);
  const values = subSerie.map((s) => s.valor);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Evolución de " + moneda,
        data: values,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  console.info(labels, values);
  if(chart != null ) {
    chart.destroy();
  } 
  
  chart = new Chart(ctx, {
    type:"line",
    data: data
  });
}

document
  .getElementById("boton-convertir")
  .addEventListener("click", async (event) => {
    const peso = inputCLP.value;
    const moneda = selectMoneda.value;

    try {
      const data = await convertir(peso, moneda);
      const serie = data.serie;

      actualizarValor(serie[0].valor);
      mostrarGrafico(moneda, serie);

      console.info(serie);
    } catch (error) {
      console.info(error.message);
      console.error("Error", error.message);
    }
  });

// inputCLP.value = 123456;
// document.getElementById("boton-convertir").click();
