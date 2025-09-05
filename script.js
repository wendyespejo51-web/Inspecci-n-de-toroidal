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

  // Capturar datos de cada campo de número
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento) {
      if (["codigo","NodoFinal"].includes(campo)) {
        datos[campo] = parseInt(elemento.value);
        } else if (["fecha"].includes(campo)) {
        // ⚡ Usamos la fecha en formato texto dd/mm/yyyy
        datos[campo] = elemento.getAttribute("data-texto");
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
    const response = await fetch("xxx", {
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
