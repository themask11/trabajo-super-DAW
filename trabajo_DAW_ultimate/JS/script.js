const equipo = [
    {
        nombre: 'Vicente Leiva',
        rol: 'Desarrollador HTML, CSS y JavaScript',
        foto: 'IMG/yo.jpg',
        descripcion: 'Especializado en el dominio de código y diseño web.'
    },
    {
        nombre: 'Marge Simpson',
        rol: 'Veterinaria Principal',
        foto: 'IMG/marge.jpg',
        descripcion: 'Especialista en salud animal y atención de urgencias.'
    },
    {
        nombre: 'Eric Cartman',
        rol: 'Especialista en cuidado animal',
        foto: 'IMG/cartman.jpg',
        descripcion: 'Encargado del cuidado, ambientación y alimentación de mascotas.'
    },
    {
        nombre: 'Peter Griffin',
        rol: 'Especialista en Marketing digital',
        foto: 'IMG/peter.jpg',
        descripcion: 'Encargado de revisar tendencias y diseño'
    },
    {
        nombre: 'Beatriz Pinzón',
        rol: 'Especialista en Administración empresarial',
        foto: 'IMG/betty.jpg',
        descripcion: 'Encargada de la administración y organización de la empresa.'
    }
];

const contenedor = document.getElementById('equipo');
if (contenedor) {
    equipo.forEach(persona => {
        contenedor.innerHTML += `
            <div class="tarjeta">
                <img src="${persona.foto}" alt="${persona.nombre}">
                <h3>${persona.nombre}</h3>
                <p><strong>Rol:</strong> ${persona.rol}</p>
                <p>${persona.descripcion}</p>
            </div>
        `;
    });
}

const formulario = document.getElementById('form-mascota');

if (formulario) {
    const inputPeso = document.getElementById('peso');
    const inputEstadia = document.getElementById('estadia');
    const inputCoste = document.getElementById('coste');

    const mensajeContenedor = document.createElement('div');
    mensajeContenedor.id = 'mensaje-verificacion';
    mensajeContenedor.style.marginTop = '10px';
    formulario.appendChild(mensajeContenedor);

    function actualizarCostePorHora() {
        const peso = parseInt(inputPeso.value, 10);
        if (!isNaN(peso) && peso > 15) {
            inputCoste.value = "$1500 por hora ($500 extra por peso mayor a 15kg)";
        } else {
            inputCoste.value = "$1000 por hora";
        }
    }

    if (inputPeso) {
        inputPeso.addEventListener('input', actualizarCostePorHora);
    }

    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreMascota = document.getElementById('nombre').value.trim();
        const pesoMascota = parseInt(inputPeso.value, 10);
        const horasEstadia = parseInt(inputEstadia.value, 10);

        if (!nombreMascota || isNaN(pesoMascota) || isNaN(horasEstadia)) {
            mensajeContenedor.innerHTML = `<div style="color: #dc3545; font-weight: bold; text-align: center; font-size: 13px;">campo ingresado erróneo</div>`;
            return;
        }

        if (pesoMascota <= 0 || horasEstadia <= 0) {
            mensajeContenedor.innerHTML = `<div style="color: #dc3545; font-weight: bold; text-align: center; font-size: 13px;">campo ingresado erróneo</div>`;
            return;
        }

        if (horasEstadia > 5) {
            mensajeContenedor.innerHTML = `<div style="color: #dc3545; font-weight: bold; text-align: center; font-size: 13px;">Por bienestar animal, la estadía máxima permitida es de 5 horas.</div>`;
            return;
        }
        if (inputEstadia) {
            inputEstadia.addEventListener('input', function () {
                if (parseInt(this.value, 10) > 5) {
                    this.setCustomValidity("Por bienestar animal, la estadía máxima permitida es de 5 horas.");
                } else {
                    this.setCustomValidity("");
                }
            });
        }

        let tarifaHoraBase = pesoMascota > 15 ? 1500 : 1000;
        const totalAPagar = tarifaHoraBase * horasEstadia;

        const fechaActual = new Date();
        const horaFormateada = fechaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const nuevaReserva = {
            id: Date.now(),
            nombre: nombreMascota,
            peso: pesoMascota,
            horas: horasEstadia,
            horaIngreso: horaFormateada,
            total: totalAPagar
        };

        let reservas = JSON.parse(localStorage.getItem('reservasMascotas')) || [];
        reservas.push(nuevaReserva);
        localStorage.setItem('reservasMascotas', JSON.stringify(reservas));

        mensajeContenedor.innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 4px; font-size: 12px;">
                <h4 style="margin: 0 0 5px 0; font-size: 13px;">Ingreso Confirmado y Guardado en LocalStorage</h4>
                <p style="margin: 2px 0;"><strong>Mascota:</strong> ${nombreMascota}</p>
                <p style="margin: 2px 0;"><strong>Peso:</strong> ${pesoMascota} kg</p>
                <p style="margin: 2px 0;"><strong>Horas:</strong> ${horasEstadia} hrs</p>
                <p style="margin: 2px 0;"><strong>Hora de Ingreso:</strong> ${horaFormateada}</p>
                <p style="margin: 2px 0; font-weight: bold;">Total: $${totalAPagar}</p>
            </div>
        `;
        formulario.reset();
    });
}

const formLogin = document.getElementById('form-login');
const seccionLogin = document.getElementById('seccion-login');
const panelAdmin = document.getElementById('panel-admin');
const tablaReservas = document.getElementById('tabla-reservas');
const btnLogout = document.getElementById('btn-logout');
const mensajeLogin = document.getElementById('mensaje-login');

function cargarTablaAdmin() {
    if (!tablaReservas) return;

    const reservas = JSON.parse(localStorage.getItem('reservasMascotas')) || [];
    tablaReservas.innerHTML = '';

    if (reservas.length === 0) {
        tablaReservas.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 8px;">No hay registros almacenados.</td></tr>';
        return;
    }

    reservas.forEach(res => {
        tablaReservas.innerHTML += `
            <tr>
                <td>${res.nombre}</td>
                <td>${res.peso} kg</td>
                <td>${res.horas} hrs</td>
                <td>${res.horaIngreso || 'N/A'}</td>
                <td>$${res.total}</td>
                <td>
                    <button type="button" class="btn-eliminar" onclick="eliminarRegistro(${res.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.eliminarRegistro = function (id) {
    const confirmacion = confirm("ADVERTENCIA: Esta acción eliminará el registro de forma permanente y no se podrá restaurar. ¿Desea continuar?");

    if (confirmacion) {
        let reservas = JSON.parse(localStorage.getItem('reservasMascotas')) || [];
        reservas = reservas.filter(res => res.id !== id);
        localStorage.setItem('reservasMascotas', JSON.stringify(reservas));
        cargarTablaAdmin();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const sesionActiva = localStorage.getItem('sesionIniciada');

    if (sesionActiva === 'true' && seccionLogin && panelAdmin) {
        seccionLogin.style.display = 'none';
        panelAdmin.style.display = 'block';
        cargarTablaAdmin();
    }
});

if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const user = document.getElementById('usuario').value.trim();
        const pass = document.getElementById('password').value.trim();

        if (mensajeLogin) mensajeLogin.innerHTML = '';

        if (!user || !pass) {
            mensajeLogin.innerHTML = `<div style="color: #dc3545; font-weight: bold; text-align: center; font-size: 13px;">campo ingresado erróneo</div>`;
            return;
        }

        if (user === 'admin' && pass === '1234') {
            localStorage.setItem('sesionIniciada', 'true');
            seccionLogin.style.display = 'none';
            panelAdmin.style.display = 'block';
            cargarTablaAdmin();
        } else {
            mensajeLogin.innerHTML = `<div style="color: #dc3545; font-weight: bold; text-align: center; font-size: 13px;">campo ingresado erróneo</div>`;
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', function () {
        localStorage.removeItem('sesionIniciada');
        panelAdmin.style.display = 'none';
        seccionLogin.style.display = 'block';
        if (mensajeLogin) mensajeLogin.innerHTML = '';
        formLogin.reset();
    });
}

const formFinanzas = document.getElementById('form-finanzas');
const resultadoFinanzas = document.getElementById('resultado-finanzas');

if (formFinanzas) {
    formFinanzas.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputCPC = document.getElementById('cpc').value.trim();
        const inputClics = document.getElementById('clics').value.trim();

        if (resultadoFinanzas) resultadoFinanzas.innerHTML = '';

        let errores = [];

        if (!inputCPC && !inputClics) {
            errores.push("Los campos solicitados están vacíos.");
        } else {
            if (!inputCPC) {
                errores.push("El primer <strong>Dato</strong> está vacío.");
            }
            if (!inputClics) {
                errores.push("El segundo <strong>Dato</strong> está vacío.");
            }
        }

        if (inputCPC && isNaN(inputCPC)) {
            errores.push("El primer <strong>Dato</strong> debe ser numérico.");
        }
        if (inputClics && isNaN(inputClics)) {
            errores.push("El segundo <strong>Dato</strong> debe ser numérico.");
        }

        if (inputCPC && !isNaN(inputCPC) && parseFloat(inputCPC) <= 0) {
            errores.push("El primer <strong>Dato</strong> debe ser mayor a 0.");
        }
        if (inputClics && !isNaN(inputClics) && parseInt(inputClics, 10) <= 0) {
            errores.push("El segundo <strong>Dato</strong> debe ser mayor a 0.");
        }

        if (errores.length > 0) {
            resultadoFinanzas.innerHTML = `
                <div style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; font-size: 12px;">
                    <strong style="display: block; margin-bottom: 4px;">Error en el formulario:</strong>
                    <ul style="margin: 0; padding-left: 18px;">
                        ${errores.map(err => `<li>${err}</li>`).join('')}
                    </ul>
                </div>
            `;
            return;
        }

        const cpc = parseFloat(inputCPC);
        const clics = parseInt(inputClics, 10);
        const costoMensual = cpc * clics;

        let htmlResultado = `
            <div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 4px; text-align: center; font-size: 13px;">
                <p style="margin: 0; font-weight: bold;">Costo mensual estimado en Google Ads: $${costoMensual.toLocaleString('es-CL')} CLP</p>
            </div>
        `;

        if (costoMensual > 50000) {
            htmlResultado += `
                <div style="background-color: #fff3cd; color: #856404; padding: 8px; border-radius: 4px; margin-top: 8px; font-weight: bold; text-align: center; border: 1px solid #ffeeba; font-size: 12px;">
                    Advertencia: El presupuesto mensual calculado supera los $50.000 CLP.
                </div>
            `;
        }

        resultadoFinanzas.innerHTML = htmlResultado;
    });
}