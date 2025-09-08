// ===== 1. LISTA DE DATOS PARA LOS CAMPOS =====
const listaSED = [
  "00021S", "00023S", "00028S", "00029S", "00030S", "00031S",
  "00036S", "00041S", "00043S", "00044S", "00049S", "00051S",
  "00052S", "00054S", "00055S", "00056S", "00058S", "06000S",
  "80001S",
];

const listaNodoFinal = [
  "01103S", "00123T", "00127S", "13647T", "01032S", "00031S",
  "65337X", "01435S", "00457S", "G01", "18013T", "17405T",
  "06108C", "00036S", "00329S", "00433S", "14329T", "30326A",
];

// ===== 2. FUNCIÓN DE AUTOCOMPLETADO REUTILIZABLE =====
function setupAutocomplete(inputElement, dataList, suggestionsElement) {
  inputElement.addEventListener("input", () => {
    const value = inputElement.value.trim().toUpperCase();
    suggestionsElement.innerHTML = "";
    suggestionsElement.style.display = "none";

    if (value.length === 0) return;

    // Filtra la lista de datos basada en lo que el usuario escribió
    const filteredData = dataList.filter(item => item.includes(value));

    if (filteredData.length > 0) {
      suggestionsElement.style.display = "block";
      filteredData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
          inputElement.value = item;
          suggestionsElement.style.display = "none";
          inputElement.focus();
        });
        suggestionsElement.appendChild(li);
      });
    }
  });

  // Cierra la lista si se hace clic fuera del campo de entrada o de la lista de sugerencias
  document.addEventListener("click", (e) => {
    if (e.target !== inputElement && !suggestionsElement.contains(e.target)) {
      suggestionsElement.style.display = "none";
    }
  });

  // Cierra la lista con la tecla ESC
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      suggestionsElement.style.display = "none";
    }
  });
}

// ===== 3. INICIALIZAR LA FUNCIÓN PARA CADA CAMPO =====
const inputSED = document.getElementById("codigo");
const suggestionsListSED = document.getElementById("suggestions");

const inputNodoFinal = document.getElementById("NodoFinal");
const suggestionsListNodoFinal = document.getElementById("suggestions2");

setupAutocomplete(inputSED, listaSED, suggestionsListSED);
setupAutocomplete(inputNodoFinal, listaNodoFinal, suggestionsListNodoFinal);

document.addEventListener("DOMContentLoaded", function () {
  // 📌 Generar la fecha actual
  let hoy = new Date();
  let year = hoy.getFullYear();
  let month = String(hoy.getMonth() + 1).padStart(2, '0');
  let day = String(hoy.getDate()).padStart(2, '0');

  // Formato para mostrar en el input (type="date")
  let fechaISO = `${year}-${month}-${day}`;
  document.getElementById("fecha").value = fechaISO;

  // Formato texto dd/mm/yyyy para registrar en Excel
  let fechaTexto = `${day}/${month}/${year}`;
  document.getElementById("fecha").setAttribute("data-texto", fechaTexto);
});

document.getElementById("enviarBtn").addEventListener("click", async function(e) {
  e.preventDefault();

  // Objeto para almacenar los datos
  const datos = {};

  // Lista de IDs de los campos, asegurando que coincidan con el esquema
  const campos = [
    "fecha", "codigo", "alim", "Celda", "NodoFinal","Responsable", "Compañero", 
    "Toroidal", "Terminal", "CablePeinado", "Tuboflex", "Criticidad", 
    "Hallazgos", "Observacion"
  ];

  // Capturar datos de cada campo
  campos.forEach(campo => {
  const elemento = document.getElementById(campo);
    if (elemento) {
      if (campo === "fecha") {
        datos[campo] = elemento.getAttribute("data-texto"); // formato dd/MM/yyyy
      } else if (["codigo","NodoFinal"].includes(campo)) {
        datos[campo] = elemento.value.trim(); // como texto
      } else {
        datos[campo] = elemento.value;
      }
    }
  });

  // Procesar las imágenes
  datos.imagenes = [];
  const archivos = document.getElementById("imagenes").files;
  for (const archivo of archivos) {
    if (datos.imagenes.length >= 5) break;
    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
    datos.imagenes.push({
      nombre: archivo.name,
      contenidoBase64: base64String
    });
  }

  // Debugging: Imprime el objeto que se va a enviar
  console.log("Objeto JSON a enviar:", datos);
  
  try {
    const response = await fetch("url HTTP de Power Automate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      alert("✅ Datos enviados correctamente");
      document.getElementById("RegistroInspeccionToroidal").reset();
      
      // Reiniciar fecha con la actual después de limpiar formulario
      let hoy = new Date();
      let year = hoy.getFullYear();
      let month = String(hoy.getMonth() + 1).padStart(2, '0');
      let day = String(hoy.getDate()).padStart(2, '0');
      let fechaISO = `${year}-${month}-${day}`;
      let fechaTexto = `${day}/${month}/${year}`;
      const fechaInput = document.getElementById("fecha");
      fechaInput.value = fechaISO;
      fechaInput.setAttribute("data-texto", fechaTexto);
      
    } else {
      alert("❌ Error al enviar datos");
    }
  } catch (error) {
    alert("⚠️ Hubo un problema con la conexión");
    console.error(error);
  }
});
