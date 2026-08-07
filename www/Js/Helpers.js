// js/helpers.js
import { CONFIG } from './config.js';
import { hablar } from './speech.js';
import { actualizarIndicador } from './ui.js';

// --- Llamadas telefónicas ---
import { PhoneCall } from '@capacitor/phone-call';
export async function hacerLlamada(numero) {
    try {
        await PhoneCall.call({ number: numero });
        hablar(`Llamando a ${numero}`);
    } catch(e) {
        hablar('No pude realizar la llamada');
    }
}

// --- Enviar SMS ---
import { SMS } from '@capacitor/sms';
export async function enviarSMS(numero, mensaje) {
    try {
        await SMS.send({ number: numero, text: mensaje });
        hablar('Mensaje enviado');
    } catch(e) {
        hablar('No pude enviar el SMS');
    }
}

// --- Leer contactos ---
import { Contacts } from '@capacitor/contacts';
export async function buscarContacto(nombre) {
    try {
        const result = await Contacts.getContacts({
            name: nombre,
            pageSize: 1
        });
        if (result.contacts.length > 0) {
            const contacto = result.contacts[0];
            return contacto;
        }
        return null;
    } catch(e) {
        return null;
    }
}

// --- Ubicación ---
import { Geolocation } from '@capacitor/geolocation';
export async function obtenerUbicacion() {
    try {
        const coords = await Geolocation.getCurrentPosition();
        return coords;
    } catch(e) {
        return null;
    }
}

// ... el resto de helpers (video, clic, etc.) son iguales a la v8
