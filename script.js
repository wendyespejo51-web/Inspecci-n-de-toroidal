document.getElementById("enviarBtn").addEventListener("click", async function(e) {
  e.preventDefault();

document.addEventListener("DOMContentLoaded", function () {
  let hoy = new Date();
  let year = hoy.getFullYear();
  let month = String(hoy.getMonth() + 1).padStart(2, '0');
  let day = String(hoy.getDate()).padStart(2, '0');
  let fechaActual = `${day}-${month}-${year}`;
  document.getElementById("fecha").value = fechaActual;
});

  // Objeto para almacenar los datos
  const datos = {};

  // Lista de IDs de los campos, asegurando que coincidan con el esquema
  const campos = [
    "fecha", "codigo", "alim", "Celda", "NodoFinal", "TipoFinal","Responsable", "Compañero", 
    "Toroidal", "Terminal", "CablePeinado", "Tuboflex", "Criticidad", 
    "Hallazgos", "Observacion"
  ];

  // Capturar datos de cada campo de número
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento) {
      if (["codigo","NodoFinal"].includes(campo)) {
        datos[campo] = parseInt(elemento.value);
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
    const response = await fetch("https://prod-29.brazilsouth.logic.azure.com:443/workflows/55c50e4786ac4b6d8e7c847e073406c8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0AJgO27Tp2dSUdwcv5ties3GrFuGZ_2bbMP0nGYPKbk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      alert("✅ Datos enviados correctamente");
      document.getElementById("RegistroInspeccionToroidal").reset();
      document.getElementById("fecha").value = new Date().toLocaleDateString("es-PE");
    } else {
      alert("❌ Error al enviar datos");
    }
  } catch (error) {
    alert("⚠️ Hubo un problema con la conexión");
    console.error(error);
  }
});
