// Referencias al DOM
const tablero = document.getElementById('tablero-cartas');
const btnBarajar = document.getElementById('btn-barajar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const zonaLectura = document.getElementById('zona-lectura');
const contenedorResultados = document.getElementById('contenedor-resultados');
const instrucciones = document.getElementById('instrucciones');

// Variables de estado
let mazoActual = [];
let cartasSeleccionadas = [];
const MAX_CARTAS = 3;
const POSICIONES = ["Pasado", "Presente", "Futuro"];

// 1. Algoritmo Fisher-Yates para barajar
function barajarMazo(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    // Asignar aleatoriamente si la carta sale invertida (50% probabilidad)
    return copia.map(carta => ({
        ...carta,
        invertida: Math.random() < 0.5
    }));
}

// 2. Renderizar las cartas boca abajo en el tablero
function iniciarJuego() {
    cartasSeleccionadas = [];
    zonaLectura.classList.add('oculto');
    contenedorResultados.innerHTML = '';
    tablero.innerHTML = '';
    
    mazoActual = barajarMazo(MAZO_TAROT);
    instrucciones.textContent = `Selecciona ${MAX_CARTAS} cartas del tablero...`;

    mazoActual.forEach((carta, index) => {
        const cartaEl = document.createElement('div');
        cartaEl.classList.add('carta');
        cartaEl.dataset.index = index;

        // Estructura HTML interna para el efecto 3D
        cartaEl.innerHTML = `
            <div class="carta-inner">
                <div class="carta-reverso">✧</div>
                <div class="carta-frente ${carta.invertida ? 'invertida' : ''}">
                    <span style="font-size: 2.5rem;">${carta.simbolo}</span>
                    <strong style="margin-top: 10px;">${carta.nombre}</strong>
                </div>
            </div>
        `;

        cartaEl.addEventListener('click', () => seleccionarCarta(cartaEl, carta));
        tablero.appendChild(cartaEl);
    });

    // Disparar animación visual de barajado
    tablero.classList.add('barajando');
    setTimeout(() => tablero.classList.remove('barajando'), 800);
}

// 3. Manejar la selección del usuario
function seleccionarCarta(elementoHTML, datosCarta) {
    // Evitar seleccionar más de 3 cartas o elegir la misma dos veces
    if (cartasSeleccionadas.length >= MAX_CARTAS || elementoHTML.classList.contains('volteada')) {
        return;
    }

    // Voltear carta visualmente
    elementoHTML.classList.add('volteada');
    cartasSeleccionadas.push(datosCarta);

    const restantes = MAX_CARTAS - cartasSeleccionadas.length;
    if (restantes > 0) {
        instrucciones.textContent = `Has elegido ${cartasSeleccionadas.length}. Selecciona ${restantes} más.`;
    } else {
        instrucciones.textContent = "¡Lectura completada! Desliza hacia abajo para ver el significado.";
        mostrarInterpretacion();
    }
}

// 4. Generar y mostrar la interpretación final
function mostrarInterpretacion() {
    zonaLectura.classList.remove('oculto');

    cartasSeleccionadas.forEach((carta, idx) => {
        const posicion = POSICIONES[idx];
        const orientacionTexto = carta.invertida ? "(Invertida)" : "(Al derecho)";
        const significado = carta.invertida ? carta.invertido : carta.derecho;

        const tarjetaHTML = document.createElement('div');
        tarjetaHTML.classList.add('tarjeta-interpretacion');
        tarjetaHTML.innerHTML = `
            <span class="posicion-tag">${posicion}</span>
            <h3>${carta.simbolo} ${carta.nombre} <small>${orientacionTexto}</small></h3>
            <p>${significado}</p>
        `;

        contenedorResultados.appendChild(tarjetaHTML);
    });

    // Scroll suave hacia los resultados
    zonaLectura.scrollIntoView({ behavior: 'smooth' });
}

// Eventos de botones
btnBarajar.addEventListener('click', iniciarJuego);
btnReiniciar.addEventListener('click', iniciarJuego);

// Arrancar automáticamente al entrar a la web
window.addEventListener('DOMContentLoaded', iniciarJuego);