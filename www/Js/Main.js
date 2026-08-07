// js/main.js
import { CONFIG } from './config.js';
import { guardarValor, leerValor } from './storage.js';
import { crearInterfaz, actualizarIndicador } from './ui.js';
import { activarJarvis, desactivarJarvis, setupSpeechListeners, ultimaActividadReal, registrarActividad } from './speech.js';
import { procesarComando } from './commands.js';

function iniciar() {
    crearInterfaz();
    actualizarIndicador('inactivo', 'Toca para activar');
    setupSpeechListeners();

    // Intentar reanudar sesión activa
    const hasta = parseInt(localStorage.getItem('jarvisSesionActivaHasta') || '0', 10);
    if (hasta && Date.now() < hasta) {
        activarJarvis();
    }

    // Vigilancia anti-cuelgue y auto-apagado (igual que antes)
    setInterval(() => {
        if (!activo || detenidoPorError) return;
        if (Date.now() - ultimoLatido > 15000) {
            console.log('[Jarvis] Reiniciando reconocimiento...');
            ultimoLatido = Date.now();
            detenerReconocimiento();
            setTimeout(iniciarReconocimiento, 300);
        }
        const restante = CONFIG.autoApagadoMs - (Date.now() - ultimaActividadReal);
        if (restante <= 0) {
            hablar('Me apago por inactividad');
            desactivarJarvis();
            return;
        }
        if (restante <= 10000 && modo === 'espera_wake') {
            actualizarIndicador('escuchando', `Apagando en ${Math.ceil(restante/1000)}s`);
        }
        registrarActividad();
    }, 4000);
}

document.addEventListener('DOMContentLoaded', iniciar);
