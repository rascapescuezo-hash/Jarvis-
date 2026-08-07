// js/storage.js
export function guardarValor(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch(e) {}
}
export function leerValor(clave) {
    try { return localStorage.getItem(clave); } catch(e) { return null; }
}
export function borrarValor(clave) {
    try { localStorage.removeItem(clave); } catch(e) {}
}
