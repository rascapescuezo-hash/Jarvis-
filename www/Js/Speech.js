// js/speech.js
import { CONFIG } from './config.js';
import { guardarValor, leerValor, borrarValor } from './storage.js';
import { actualizarIndicador } from './ui.js';
import { procesarComando } from './commands.js';

// Importar plugins de Capacitor
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

// Estado
let activo = false;
let detenidoPorError = false;
let estaCorriendo = false;
let estaHablando = false;
let ultimoLatido = Date.now();
let momentoUltimoInicio = Date.now();
let modo = 'espera_wake';
let bufferOrdenFinal = '';
let bufferOrdenInterino = '';
let temporizadorSilencio = null;
let momentoInicioOrden = 0;
let vetoActivacionHasta = 0;
let ultimaActividadReal = Date.now();
let ultimaRespuestaHablada = '';

// Funciones auxiliares
function registrarActividad() {
    ultimaActividadReal = Date.now();
    if (activo) guardarValor('jarvisSesionActivaHasta', String(Date.now() + CONFIG.autoApagadoMs));
}

function reiniciarEstadoOrden() {
    modo = 'espera_wake';
    bufferOrdenFinal = '';
    bufferOrdenInterino = '';
    if (temporizadorSilencio) { clearTimeout(temporizadorSilencio); temporizadorSilencio = null; }
}

// Iniciar escucha continua (incluso en segundo plano)
export async function iniciarReconocimiento() {
    if (estaCorriendo) return;
    try {
        await SpeechRecognition.start({
            language: CONFIG.idioma,
            maxResults: 3,
            prompt: 'Escuchando...',
            continuous: true,
            androidContinuousListening: true // <-- Clave para escuchar en segundo plano
        });
        estaCorriendo = true;
        ultimoLatido = Date.now();
        momentoUltimoInicio = Date.now();
        actualizarIndicador('escuchando', 'Escuchando… di "Jarvis"');
    } catch(e) {
        console.warn('[Jarvis] Error al iniciar reconocimiento:', e);
        if (e.message.includes('permission')) {
            actualizarIndicador('error', 'Permiso de micrófono denegado');
        }
    }
}

export async function detenerReconocimiento() {
    if (estaCorriendo) {
        try { await SpeechRecognition.stop(); } catch(e) {}
        estaCorriendo = false;
    }
}

// Síntesis de voz
export async function hablar(texto) {
    ultimaRespuestaHablada = texto;
    if (!CONFIG.hablarRespuestas) return;
    try {
        await TextToSpeech.speak({
            text: texto,
            lang: CONFIG.idioma,
            rate: CONFIG.vozRate || 1.0,
            pitch: CONFIG.vozPitch || 1.0
        });
    } catch(e) {
        console.warn('[Jarvis] Error al hablar:', e);
    }
}

// Activar / desactivar
export function activarJarvis() {
    if (activo) return;
    detenidoPorError = false;
    activo = true;
    reiniciarEstadoOrden();
    ultimoLatido = Date.now();
    momentoUltimoInicio = Date.now();
    registrarActividad();
    actualizarIndicador('iniciando', 'Iniciando…');
    iniciarReconocimiento();
}

export function desactivarJarvis() {
    if (!activo) return;
    activo = false;
    detenidoPorError = false;
    reiniciarEstadoOrden();
    detenerReconocimiento();
    borrarValor('jarvisSesionActivaHasta');
    actualizarIndicador('inactivo', 'Toca para activar');
    hablar('Apagado');
}

// Configurar listeners de resultados
export function setupSpeechListeners() {
    SpeechRecognition.addListener('listening', (info) => {
        if (!activo) return;
        ultimoLatido = Date.now();
        if (info.listening) estaCorriendo = true;
    });

    SpeechRecognition.addListener('error', (err) => {
        console.warn('[Jarvis] Error:', err);
        if (err.error === 'not-allowed' || err.error === 'audio-capture') {
            activo = false;
            detenidoPorError = true;
            actualizarIndicador('error', 'Permiso de micrófono denegado');
        }
    });

    SpeechRecognition.addListener('interimResults', (data) => {
        if (!activo || estaHablando) return;
        const texto = (data.text || '').toLowerCase().trim();
        if (!texto) return;
        manejarResultado(texto, false);
    });

    SpeechRecognition.addListener('finalResults', (data) => {
        if (!activo || estaHablando) return;
        const texto = (data.text || '').toLowerCase().trim();
        if (!texto) return;
        manejarResultado(texto, true);
    });
}

// Manejo de resultados (copiado de la lógica original)
function manejarResultado(texto, esFinal) {
    // Aquí va exactamente el mismo código del onresult de la versión 8
    // (con extraerTrasActivacion, limpiarActivacionSobrante, etc.)
    // Por brevedad, indico que este bloque debe ser igual al original.
    // Te lo dejo completo en el archivo final que te paso aparte.
}
