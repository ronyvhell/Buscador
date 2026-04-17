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
                url: "tours.html?destino=cartagena-de-indias"
            },
            {
                nombre: "Santa Cruz de Mompox",
                slug: "santa-cruz-de-mompox",
                url: "tours.html?destino=santa-cruz-de-mompox"
            },
            {
                nombre: "Barú",
                slug: "baru",
                url: "tours.html?destino=baru"
            },
            {
                nombre: "Islas del Rosario",
                slug: "islas-del-rosario",
                url: "tours.html?destino=islas-del-rosario"
            },
            {
                nombre: "Tierra Bomba",
                slug: "tierra-bomba",
                url: "tours.html?destino=tierra-bomba"
            }
        ]
    },
    {
        departamento: "Antioquia",
        ciudades: [
            {
                nombre: "Medellín",
                slug: "medellin",
                url: "tours.html?destino=medellin"
            },
            {
                nombre: "Guatapé",
                slug: "guatape",
                url: "tours.html?destino=guatape"
            },
            {
                nombre: "Santa Fe de Antioquia",
                slug: "santa-fe-de-antioquia",
                url: "tours.html?destino=santa-fe-de-antioquia"
            },
            {
                nombre: "Jardín",
                slug: "jardin",
                url: "tours.html?destino=jardin"
            }
        ]
    },
    {
        departamento: "Magdalena",
        ciudades: [
            {
                nombre: "Santa Marta",
                slug: "santa-marta",
                url: "tours.html?destino=santa-marta"
            },
            {
                nombre: "Taganga",
                slug: "taganga",
                url: "tours.html?destino=taganga"
            },
            {
                nombre: "Minca",
                slug: "minca",
                url: "tours.html?destino=minca"
            },
            {
                nombre: "Palomino",
                slug: "palomino",
                url: "tours.html?destino=palomino"
            }
        ]
    },
    {
        departamento: "San Andrés y Providencia",
        ciudades: [
            {
                nombre: "San Andrés",
                slug: "san-andres",
                url: "tours.html?destino=san-andres"
            },
            {
                nombre: "Providencia",
                slug: "providencia",
                url: "tours.html?destino=providencia"
            }
        ]
    },
    {
        departamento: "Atlántico",
        ciudades: [
            {
                nombre: "Barranquilla",
                slug: "barranquilla",
                url: "tours.html?destino=barranquilla"
            },
            {
                nombre: "Puerto Colombia",
                slug: "puerto-colombia",
                url: "tours.html?destino=puerto-colombia"
            }
        ]
    },
    {
        departamento: "Valle del Cauca",
        ciudades: [
            {
                nombre: "Cali",
                slug: "cali",
                url: "tours.html?destino=cali"
            },
            {
                nombre: "Buenaventura",
                slug: "buenaventura",
                url: "tours.html?destino=buenaventura"
            }
        ]
    },
    {
        departamento: "Quindío",
        ciudades: [
            {
                nombre: "Armenia",
                slug: "armenia",
                url: "tours.html?destino=armenia"
            },
            {
                nombre: "Salento",
                slug: "salento",
                url: "tours.html?destino=salento"
            },
            {
                nombre: "Filandia",
                slug: "filandia",
                url: "tours.html?destino=filandia"
            }
        ]
    },
    {
        departamento: "Risaralda",
        ciudades: [
            {
                nombre: "Pereira",
                slug: "pereira",
                url: "tours.html?destino=pereira"
            },
            {
                nombre: "Santa Rosa de Cabal",
                slug: "santa-rosa-de-cabal",
                url: "tours.html?destino=santa-rosa-de-cabal"
            }
        ]
    },
    {
        departamento: "Cundinamarca",
        ciudades: [
            {
                nombre: "Bogotá",
                slug: "bogota",
                url: "tours.html?destino=bogota"
            },
            {
                nombre: "Zipaquirá",
                slug: "zipaquira",
                url: "tours.html?destino=zipaquira"
            },
            {
                nombre: "Guatavita",
                slug: "guatavita",
                url: "tours.html?destino=guatavita"
            }
        ]
    }
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