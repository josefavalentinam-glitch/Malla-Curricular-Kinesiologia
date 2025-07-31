// Lista de ramos por semestre
const malla = {
  1: ["Biología Celular e Histología", "Química General y Orgánica", "Anatomía General", "Introducción a la Kinesiología", "Matemáticas", "Comunicación Académica"],
  2: ["Bioquímica", "Fisiología General", "Anatomía y Cinesiología", "Movimiento Humano", "Responsabilidad Social"],
  3: ["Fisiopatología", "Neurociencias", "Farmacología", "Biofísica", "Desarrollo del Pensamiento Crítico"],
  4: ["Neurofisiología", "Exploración Física Funcional", "Análisis del Movimiento Funcional y Disfuncional", "Fisiología del Ejercicio", "Electivo de Comunicación"],
  5: ["Disfunción del Sistema Locomotor", "Terapia por Agentes Físicos I", "Proyecto de Investigación I", "Salud Familiar y Comunitaria", "Electivo de Ética"],
  6: ["Kinesiología del Deporte", "Terapia por Agentes Físicos II", "Metodología de la Investigación", "Epidemiología y Salud Pública", "Electivo de Desarrollo Personal"],
  7: ["Intervención Kinesiológica Neuromotriz", "Intervención Kinesiológica Cardiorrespiratoria", "Proyecto de Investigación II", "Intervención Kinesiológica en el Adulto Mayor", "Electivo de Responsabilidad Social"],
  8: ["Diagnóstico e Intervención Kinesiológica I", "Diagnóstico e Intervención Kinesiológica II", "Gestión en Salud", "Salud Ocupacional y Ergonomía", "Práctica Profesional I"],
  9: ["Práctica Profesional II", "Práctica Profesional III", "Práctica Profesional IV", "Práctica Profesional V"],
  10: []
};

// Requisitos
const requisitos = {
  "Fisiología General": ["Bioquímica"],
  "Farmacología": ["Fisiología General"],
  "Fisiopatología": ["Fisiología General"],
  "Neurofisiología": ["Neurociencias"],
  "Exploración Física Funcional": ["Anatomía y Cinesiología"],
  "Fisiología del Ejercicio": ["Fisiología General"],
  "Disfunción del Sistema Locomotor": ["Anatomía y Cinesiología"],
  "Terapia por Agentes Físicos I": ["Fisiología General"],
  "Terapia por Agentes Físicos II": ["Terapia por Agentes Físicos I"],
  "Proyecto de Investigación II": ["Proyecto de Investigación I"],
  "Intervención Kinesiológica Neuromotriz": ["Neurofisiología"],
  "Intervención Kinesiológica Cardiorrespiratoria": ["Fisiología del Ejercicio"],
  "Diagnóstico e Intervención Kinesiológica I": ["Intervención Kinesiológica Neuromotriz", "Terapia por Agentes Físicos II"],
  "Diagnóstico e Intervención Kinesiológica II": ["Diagnóstico e Intervención Kinesiológica I"],
  "Práctica Profesional I": ["Proyecto de Investigación I", "Terapia por Agentes Físicos I"],
  "Práctica Profesional II": ["Práctica Profesional I"],
  "Práctica Profesional III": ["Práctica Profesional I"],
  "Práctica Profesional IV": ["Práctica Profesional I"],
  "Práctica Profesional V": ["Práctica Profesional I"]
};

// Función para crear la malla
function generarMalla() {
  const container = document.getElementById("malla-container");
  const estadoGuardado = JSON.parse(localStorage.getItem("ramosAprobados")) || [];

  for (let semestre in malla) {
    const columna = document.createElement("div");
    columna.classList.add("semestre");

    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${semestre}`;
    columna.appendChild(titulo);

    malla[semestre].forEach(ramo => {
      const div = document.createElement("div");
      div.classList.add("ramo");
      div.textContent = ramo;

      if (estadoGuardado.includes(ramo)) {
        div.classList.add("aprobado");
      }

      actualizarEstadoBloqueado(div, estadoGuardado);

      div.addEventListener("click", () => manejarClickRamo(div, estadoGuardado));

      columna.appendChild(div);
    });

    container.appendChild(columna);
  }
}

// Actualiza estilo si el ramo está bloqueado por requisitos
function actualizarEstadoBloqueado(div, aprobados) {
  const reqs = requisitos[div.textContent];
  if (reqs && !reqs.every(r => aprobados.includes(r))) {
    div.classList.add("bloqueado");
  }
}

// Manejador al hacer clic en un ramo
function manejarClickRamo(div, aprobados) {
  const nombre = div.textContent;

  if (div.classList.contains("bloqueado")) {
    const faltan = requisitos[nombre].filter(r => !aprobados.includes(r));
    mostrarMensaje(`No puedes aprobar "${nombre}" aún. Faltan: ${faltan.join(", ")}`);
    return;
  }

  div.classList.toggle("aprobado");
  const index = aprobados.indexOf(nombre);

  if (index >= 0) {
    aprobados.splice(index, 1);
  } else {
    aprobados.push(nombre);
  }

  localStorage.setItem("ramosAprobados", JSON.stringify(aprobados));
  actualizarTodosBloqueos(aprobados);
}

// Actualiza todos los estados bloqueados
function actualizarTodosBloqueos(aprobados) {
  document.querySelectorAll(".ramo").forEach(div => {
    div.classList.remove("bloqueado");
    actualizarEstadoBloqueado(div, aprobados);
  });
}

// Muestra mensaje de error temporal
function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje-error");
  mensaje.textContent = texto;
  mensaje.classList.remove("oculto");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 4000);
}

// Iniciar
document.addEventListener("DOMContentLoaded", generarMalla);

