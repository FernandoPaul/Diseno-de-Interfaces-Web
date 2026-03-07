// ELEMENTOS DEL DOM
const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");
const progressText = document.getElementById("progressText");

// --- FUNCIÓN PARA AÑADIR TAREAS ---
habitForm.addEventListener("submit", function(e){
    e.preventDefault(); // Evita que el formulario recargue la página
    const habitName = habitInput.value.trim(); // Obtenemos el nombre del hábito
    //validacion simple
    if (habitName === "") {
        alert("Por favor, ingresa un nombre para el hábito.");
        return; // Salimos de la función si el nombre está vacío
    } 
    const li = document.createElement("li");    // Agregar el elemento LI al contenedor de la lista
    // Crear un ID unico para vincular el input con el label
    const uniqueId = "habit-" + Date.now();     
    // Crear el checkbox y asignarle el ID
    const checkbox = document.createElement("input");   
    checkbox.type = "checkbox";
    checkbox.id = uniqueId;     // ID único
    
    // Crear el label y vincularlo al checkbox 
    const label = document.createElement("label");
    label.htmlFor = uniqueId;
    label.textContent = habitName;
    // Añadirlos al LI en el orden correcto
    li.appendChild(checkbox);
    li.appendChild(label);
    // Boton para eliminar la tarea
    let span = document.createElement("span");
    span.textContent = "\u00d7";                // "\u00d7" representacion en unicode de x
    li.appendChild(span);

    habitList.appendChild(li);
    habitInput.value = "";      // Limpiar el input después de añadir
    saveData();                 // Guarda los datos de manera local
});

// --- EVENTO PARA MARCAR/DESMARCAR TAREA --- 
habitList.addEventListener("click", function(e){
    if (e.target.tagName === "INPUT") {
        const li = e.target.parentElement; // Obtiene el elemento LI que contiene el checkbox
        li.classList.toggle("completada", e.target.checked);    // Alterna la clase "completada", marca/desmarca la tarea como completada según el estado del checkbox
        
        saveData();             // Guarda los datos de manera local cada vez que se marca o desmarca una tarea
        actualizarProgreso();   // Actualiza el progreso cada vez que se marca o desmarca una tarea
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();    // Elimina el elemento padre del SPAN, en este caso el LI que lo contiene
        saveData();             // Guarda los datos de manera local cada vez que se elimina una tarea
        actualizarProgreso();   // Actualiza el progreso cada vez que se elimina una tarea
    }
}, false);

// --- FUNCION PARA GUARDAR LA LISTA ---
function saveData() {
    const habitos = [];
    // Seleecciona todos los elementos del <li> que estan dentro del contenedor "HabitList"
    document.querySelectorAll("#habitList li").forEach(li => {
        // Recorre cada uno de los elementos encontrados y Añade un nuevo objeto al Array
        const checkbox = li.querySelector("input[type='checkbox']"); // Selecciona el checkbox dentro del LI
        const label = li.querySelector("label"); // Selecciona el label dentro del LI
        habitos.push({
            //Guarda el texto de la tarea y comprueba si tiene la clase "completada" devolviendo true o false
            texto: label.textContent,
            completado: checkbox.checked
        });
    });

    localStorage.setItem("habitos", JSON.stringify(habitos)); // Alamcena los datos de cada tarea en formato JSON
}

// --- FUNCION PARA MOSTRAR LA LISTA GUARDADA ---
function showData() {
    const habitosGuardados = JSON.parse(localStorage.getItem("habitos"));
    if (!habitosGuardados) return;   //Si no existe "data" en el localStorage salir de la funcion

    habitosGuardados.forEach(habito => {
        const li = document.createElement("li");

        const uniqueId = "habit-" + Date.now() + Math.random();     // Crear un ID unico para vincular el input con el label

        const checkbox = document.createElement("input");   // Crear el checkbox y asignarle el ID
        checkbox.type = "checkbox";
        checkbox.id = uniqueId;     // ID único
        checkbox.checked = habito.completado; // Marcar el checkbox si la tarea estaba completada

        const label = document.createElement("label");    // Crear el label y vincularlo al checkbox
        label.htmlFor = uniqueId;
        label.textContent = habito.texto;

        //Si la tarea esta completada le asigno la clase "compleatado" para marcarla como tal
        if (habito.completado) {
            li.classList.add("completada");
        }

        const span = document.createElement("span");    // Crear un elemento span para el botón de eliminar
        span.textContent = "\u00d7";                    // "\u00d7" representacion en unicode de x
        
        li.appendChild(checkbox);   // Añadir el checkbox al LI
        li.appendChild(label);      // Añadir el label al LI
        li.appendChild(span);               // Asigna el span como hijo del li 
        habitList.appendChild(li);
    });
    actualizarProgreso();   // Actualiza el progreso después de cargar los datos guardados
}
// --- LLAMA A LA FUNCION showData CUANDO EL CONTENIDO DEL DOM SE HAYA CARGADO
document.addEventListener("DOMContentLoaded", showData);   

// --- FUNCION PARA CALCULAR Y MOSTRAR EL PROGRESO ---
function actualizarProgreso(){
    const total = document.querySelectorAll("#habitList li").length; // Cuenta el total de habitos en la lista
    const completados = document.querySelectorAll("#habitList li.completada").length; // Cuenta el total de habitos completados

    const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100); // Calcula el porcentaje de habitos completados
    progressText.textContent = porcentaje + "% completado"; // Muestra el porcentaje en el elemento de texto

    document.querySelector(".progress").style.width = porcentaje + "%"; // Ajusta el ancho de la barra de progreso
}