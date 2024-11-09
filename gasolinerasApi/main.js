var xhr = new XMLHttpRequest();
const btn = document.getElementById("btn");
const municipioSelect = document.getElementById("municipio");

// Función para realizar la consulta a la API de gasolineras
function consulta(idMunicipio) {
    if (!idMunicipio || idMunicipio === '---') {
        alert("Por favor, selecciona un municipio.");
        return;
    }

    // Configurar la solicitud: método, URL y si es asincrónica (true)
    xhr.open('GET', `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`, true);

    // Definir la función que se ejecutará cuando cambie el estado de la solicitud
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // Solo procesamos cuando la solicitud se ha completado
            if (xhr.status === 200) { // 200 es "OK"
                var data = JSON.parse(xhr.responseText); // Convertir JSON en objeto de JavaScript
                console.log("Respuesta de la API:", data); // Ver la respuesta completa en la consola
                mostrarGasolineras(data.ListaEESSPrecio); // Llamar a la función para mostrar los resultados
            } else {
                console.error('Error al obtener datos de la API', xhr.status, xhr.statusText);
                alert('No se pudieron obtener los datos. Inténtalo nuevamente.');
            }
        }
    };

    // Enviar la solicitud
    xhr.send();
}

function mostrarGasolineras(listaGasolineras) {
    let resultadosDiv = document.getElementById("resultadosGasolineras");
    resultadosDiv.innerHTML = ''; // Limpiar contenido previo

    if (listaGasolineras.length) {
        //Ordenar de menor a mayor
        listaGasolineras.sort((a, b) => {
            const precioA = parseFloat(a['Precio Gasolina 95 E5'].replace(',', '.')) || Infinity;
            const precioB = parseFloat(b['Precio Gasolina 95 E5'].replace(',', '.')) || Infinity;
            return precioA - precioB;
        });

        // Iterar sobre la lista de gasolineras ordenada
        listaGasolineras.forEach((estacion, index) => {
            // Crear elementos de la tarjeta
            let estacionDiv = document.createElement('div');
            estacionDiv.className = 'tarjeta-estacion';

            // Cambiar color a los tres últimos y a los 3 primeros
            if (index < 3) {
                estacionDiv.style.border = '3px solid green'; // Más baratos
            } else if (index >= listaGasolineras.length - 3) {
                estacionDiv.style.border = '3px solid red'; // Más caros
            }

            // Nombre de la estación
            let nombreEstacion = document.createElement('div');
            nombreEstacion.className = 'nombre-estacion';
            nombreEstacion.innerHTML = `${estacion['Rótulo'] || 'No disponible'}`;

            // Contenedor para precios y dirección
            let infoPrecios = document.createElement('div');
            infoPrecios.className = 'info-precios';

            // Precios de gasolina y gasóleo, y dirección
            const precioGasolina95E5 = estacion['Precio Gasolina 95 E5'] || 'No disponible';
            const precioGasoleoA = estacion['Precio Gasoleo A'] || 'No disponible';
            const precioGasoleoPremium = estacion['Precio Gasoleo Premium'] || 'No disponible';
            const precioGasolina98E5 = estacion['Precio Gasolina 98 E5'] || 'No disponible';
            const direccion = estacion['Dirección'] || 'No disponible';

            // Mostrar los precios de forma correcta
            infoPrecios.innerHTML = `
                <p><strong>Gasolina 95 E5:</strong> ${precioGasolina95E5} €/l</p>
                <p><strong>Gasoleo A:</strong> ${precioGasoleoA} €/l</p>
                <p><strong>Gasoleo Premium:</strong> ${precioGasoleoPremium} €/l</p>
                <p><strong>Gasolina 98 E5:</strong> ${precioGasolina98E5} €/l</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
            `;

            // Agregar los elementos a la tarjeta
            estacionDiv.appendChild(nombreEstacion);
            estacionDiv.appendChild(infoPrecios);

            // Agregar la tarjeta al contenedor principal
            resultadosDiv.appendChild(estacionDiv);
        });
    } else {
        // Si no hay resultados, mostrar un mensaje adecuado
        resultadosDiv.innerHTML = '<p>No se encontraron gasolineras en ese municipio.</p>';
    }
}


// Agregar el evento al botón de consulta
btn.addEventListener("click", function () {
    let municipioId = municipioSelect.value;
    consulta(municipioId); // Llamar la API con el ID del municipio seleccionado
});
