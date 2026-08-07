// js/ui.js
import { CONFIG } from './config.js';
import { guardarValor, leerValor } from './storage.js';
import { activarJarvis, desactivarJarvis, estaCorriendo, estaHablando } from './speech.js';

let boton, pill, textoIndicador, puntoIndicador;
let overlay = null;

// Crear la burbuja flotante que se superpone a otras apps
function crearOverlay() {
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'jarvis-overlay';
        document.body.appendChild(overlay);
    }
    return overlay;
}

export function crearInterfaz() {
    // Inyectar estilos (ya están en styles.css)
    crearOverlay();

    // Botón (estrella) dentro del overlay
    boton = document.createElement('div');
    boton.id = 'jarvis-boton';
    Object.assign(boton.style, {
        position: 'fixed',
        bottom: '86px',
        right: '20px',
        width: CONFIG.tamanoBoton + 'px',
        height: CONFIG.tamanoBoton + 'px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(178,142,255,0.55) 0%, rgba(60,20,90,0.25) 55%, rgba(0,0,0,0) 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '2147483647',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none'
    });
    // Estrella SVG (igual que antes)
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.id = 'jarvis-estrella';
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.style.width = '62%';
    svg.style.height = '62%';
    svg.style.filter = 'drop-shadow(0 0 4px rgba(178,142,255,0.9))';
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M12 0C12 6.6 13 9 14.8 10.8 16.6 12.6 19.4 13.5 24 13.5 19.4 13.5 16.6 14.4 14.8 16.2 13 18 12 20.4 12 27 12 20.4 11 18 9.2 16.2 7.4 14.4 4.6 13.5 0 13.5 4.6 13.5 7.4 12.6 9.2 10.8 11 9 12 6.6 12 0Z');
    path.setAttribute('fill', '#fff');
    svg.appendChild(path);
    boton.appendChild(svg);

    // Píldora (estado)
    pill = document.createElement('div');
    pill.id = 'jarvis-pill';
    Object.assign(pill.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '999px',
        background: 'rgba(28,28,30,0.9)',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        maxWidth: '78vw',
        overflow: 'hidden',
        cursor: 'pointer'
    });
    pill.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        if (estaHablando) {
            window.speechSynthesis.cancel();
            return;
        }
        if (activo) desactivarJarvis();
    });

    puntoIndicador = document.createElement('div');
    puntoIndicador.id = 'jarvis-punto';
    Object.assign(puntoIndicador.style, {
        width: '10px',
        height: '10px',
        minWidth: '10px',
        borderRadius: '50%',
        background: '#888',
        transition: 'background 0.25s ease'
    });
    textoIndicador = document.createElement('span');
    textoIndicador.style.overflow = 'hidden';
    textoIndicador.style.textOverflow = 'ellipsis';
    textoIndicador.style.whiteSpace = 'nowrap';

    pill.appendChild(puntoIndicador);
    pill.appendChild(textoIndicador);
    document.body.appendChild(pill);
    document.body.appendChild(boton);

    // Hacer que el botón sea arrastrable (como antes)
    habilitarArrastre();
    cargarPosicionGuardada();
}

export function actualizarIndicador(estado, texto) {
    const colores = {
        inactivo: '#888',
        iniciando: '#f1c40f',
        escuchando: '#2ecc71',
        ejecutando: '#3498db',
        error: '#e74c3c'
    };
    const brillos = {
        inactivo: 'rgba(150,150,150,0.5)',
        iniciando: 'rgba(241,196,15,0.6)',
        escuchando: 'rgba(46,204,113,0.6)',
        ejecutando: 'rgba(52,152,219,0.6)',
        error: 'rgba(231,76,60,0.65)'
    };
    if (boton) {
        boton.style.background = `radial-gradient(circle, ${brillos[estado] || brillos.inactivo} 0%, rgba(60,20,90,0.2) 55%, rgba(0,0,0,0) 75%)`;
        boton.style.display = estado === 'inactivo' ? 'flex' : 'none';
    }
    if (puntoIndicador) {
        puntoIndicador.style.background = colores[estado] || '#888';
        puntoIndicador.classList.toggle('jarvis-escuchando', estado === 'escuchando' || estado === 'ejecutando');
    }
    if (textoIndicador) textoIndicador.innerText = texto;
    if (pill) pill.classList.toggle('jarvis-visible', estado !== 'inactivo');
}

// Arrastre (igual que antes)
const CLAVE_POSICION = 'jarvisPosicionBoton';
function habilitarArrastre() { /* ... copiar el código de arrastre de la versión anterior ... */ }
function cargarPosicionGuardada() { /* ... */ }
function guardarPosicion() { /* ... */ }
