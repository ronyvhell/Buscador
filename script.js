const inputBuscar = document.getElementById("buscar");
const btnLimpiar = document.getElementById("buscador_limpiar");
const dropdown = document.getElementById("buscador_dropdown");
const btnExplorar = document.getElementById("explorador");
const contenedorBuscador = document.querySelector(".buscador");

const toast = document.getElementById("toast_glass");
const toastTitulo = document.getElementById("toast_titulo");
const toastMensaje = document.getElementById("toast_mensaje");
const toastCerrar = document.getElementById("toast_cerrar");

const destinos = [
    {
        departamento: "Bolívar",
        ciudades: [
            {
                nombre: "Cartagena de Indias",
                slug: "cartagena-de-indias",
                url: "https://buscador.colombiatourstickets.com/?"
            },
        
        ]
    },
];

let destinoSeleccionado = null;
let toastTimeout = null;

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function abrirDropdown() {
    dropdown.classList.add("activo");
}

function cerrarDropdown() {
    dropdown.classList.remove("activo");
}

function actualizarBotonLimpiar() {
    if (inputBuscar.value.trim() !== "") {
        btnLimpiar.classList.add("activo");
    } else {
        btnLimpiar.classList.remove("activo");
    }
}

function crearIconoPin() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-7.58 8-14a8 8 0 1 0-16 0c0 6.42 8 14 8 14zm0-10.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
        </svg>
    `;
}

function filtrarDestinos(termino) {
    const query = normalizarTexto(termino);

    if (!query) return destinos;

    return destinos
        .map((grupo) => {
            const departamentoCoincide = normalizarTexto(grupo.departamento).includes(query);

            const ciudadesFiltradas = grupo.ciudades.filter((ciudad) =>
                normalizarTexto(ciudad.nombre).includes(query)
            );

            if (departamentoCoincide) {
                return grupo;
            }

            return {
                ...grupo,
                ciudades: ciudadesFiltradas
            };
        })
        .filter((grupo) => grupo.ciudades.length > 0);
}

function renderDropdown(termino = "") {
    const resultados = filtrarDestinos(termino);

    if (resultados.length === 0) {
        dropdown.innerHTML = `<div class="dropdown_vacio">No se encontraron destinos.</div>`;
        return;
    }

    dropdown.innerHTML = resultados
        .map((grupo) => {
            const items = grupo.ciudades
                .map((ciudad) => {
                    return `
                        <button
                            type="button"
                            class="destino_item"
                            data-nombre="${ciudad.nombre}"
                            data-slug="${ciudad.slug}"
                            data-url="${ciudad.url}"
                        >
                            ${crearIconoPin()}
                            <span>${ciudad.nombre}</span>
                        </button>
                    `;
                })
                .join("");

            return `
                <div class="departamento_bloque">
                    <div class="departamento_titulo">${grupo.departamento}</div>
                    <div class="departamento_ciudades">${items}</div>
                </div>
            `;
        })
        .join("");

    const itemsDestino = dropdown.querySelectorAll(".destino_item");

    itemsDestino.forEach((item) => {
        item.addEventListener("click", () => {
            const nombre = item.dataset.nombre;
            const slug = item.dataset.slug;
            const url = item.dataset.url;

            inputBuscar.value = nombre;
            destinoSeleccionado = { nombre, slug, url };

            actualizarBotonLimpiar();
            cerrarDropdown();
        });
    });
}

function buscarDestinoExacto(valor) {
    const valorNormalizado = normalizarTexto(valor);

    for (const grupo of destinos) {
        for (const ciudad of grupo.ciudades) {
            if (normalizarTexto(ciudad.nombre) === valorNormalizado) {
                return ciudad;
            }
        }
    }

    return null;
}

function mostrarToast(mensaje, titulo = "Atención") {
    toastTitulo.textContent = titulo;
    toastMensaje.textContent = mensaje;

    toast.classList.add("activo");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        ocultarToast();
    }, 3200);
}

function ocultarToast() {
    toast.classList.remove("activo");
}

function explorarDestino() {
    let destinoFinal = destinoSeleccionado;

    if (!destinoFinal && inputBuscar.value.trim() !== "") {
        destinoFinal = buscarDestinoExacto(inputBuscar.value);
    }

    if (!destinoFinal) {
        if (inputBuscar.value.trim() === "") {
            mostrarToast("Selecciona un destino antes de explorar.");
        } else {
            mostrarToast("Selecciona un destino válido de la lista.");
        }

        inputBuscar.focus();
        renderDropdown(inputBuscar.value);
        abrirDropdown();
        return;
    }

    window.location.href = destinoFinal.url;
}

inputBuscar.addEventListener("focus", () => {
    renderDropdown(inputBuscar.value);
    abrirDropdown();
});

inputBuscar.addEventListener("click", () => {
    renderDropdown(inputBuscar.value);
    abrirDropdown();
});

inputBuscar.addEventListener("input", () => {
    destinoSeleccionado = null;
    renderDropdown(inputBuscar.value);
    abrirDropdown();
    actualizarBotonLimpiar();
});

inputBuscar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        explorarDestino();
    }

    if (e.key === "Escape") {
        cerrarDropdown();
    }
});

btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    destinoSeleccionado = null;
    renderDropdown("");
    abrirDropdown();
    actualizarBotonLimpiar();
    inputBuscar.focus();
});

btnExplorar.addEventListener("click", () => {
    explorarDestino();
});

toastCerrar.addEventListener("click", () => {
    ocultarToast();
});

document.addEventListener("click", (e) => {
    if (!contenedorBuscador.contains(e.target)) {
        cerrarDropdown();
    }
});

renderDropdown("");
actualizarBotonLimpiar();