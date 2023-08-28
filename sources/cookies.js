'use-strict'

const { AES, enc } = require("crypto-js");

/**
 * La clase Cookies proporciona métodos para configurar, obtener, eliminar y
 * destruir cookies en un navegador web.
 * 
 * @Author SoDe World.
 * @Copyright Todos los derechos reservados.
 */
class Cookies {

    static #hash = 'fcf14dfe-efb0-44bd-9268-69c06ae89c8f';

    static #domain = () => {
        const hostname = window.location.hostname;
        if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
            return hostname;
        }
        const parts = hostname.split('.');
        const numParts = parts.length;
        if (numParts >= 2) {
            return parts.slice(numParts - 2).join('.');
        } else {
            return parts.join('.');
        }
    }

    /**
     * La función establece una cookie con un nombre dado, un valor y una
     * fecha de caducidad (7 días por defecto) en el documento.
     * @param name - El nombre de la cookie que se establecerá.
     * @param value - El valor que se almacenará en la cookie.
     * @param [days = 7] - El número de días hasta que caduque la cookie. Si
     * no se especifica, el valor predeterminado es 7 días.
     */
    static set(name, value, days = false) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        value = AES.encrypt(value, this.#hash).toString()
        const cookie = `${name}=${value}${expires}; path=/; domain=.${this.#domain()}`;
        document.cookie = cookie;
    }

    /**
     * Esta función recupera el valor de una cookie por su nombre.
     * @param name - El nombre de la cookie que debe recuperarse.
     * @returns El método `get` devuelve el valor de la cookie con el nombre
     * especificado si existe, y `undefined` si no existe.
     */
    static get(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                const value = cookie.substring(name.length + 1, cookie.length);
                try {
                    return AES.decrypt(value, this.#hash).toString(enc.Utf8)
                } catch (error) {
                    console.log(error)
                    return value
                }
            }
        }
        return undefined;
    }

    /**
     * Esta función recupera todas las cookies y las devuelve como un objeto.
     * @returns La función `getAll()` devuelve un objeto que contiene todas
     * las cookies configuradas actualmente en el documento, donde los nombres
     * de las cookies son las claves y los valores de las cookies son los
     * valores.
     */
    static getAll() {
        const cookies = document.cookie.split(';');
        const result = {};
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const name = cookie.split('=')[0];
            result[name] = this.get(name)
        }
        return result;
    }

    /**
     * La función elimina una cookie estableciendo su valor en una cadena
     * vacía y estableciendo su fecha de caducidad en una fecha pasada.
     * @param name - El parámetro de nombre es una cadena que representa el
     * nombre de la cookie que debe eliminarse.
     */
    static delete(name) {
        Cookies.set(name, '', -1);
    }

    /**
     * Esta función elimina todas las cookies almacenadas en el navegador.
     */
    static destroy() {
        const cookies = Cookies.getAll();
        for (const name in cookies) {
            if (name === 'XSRF-TOKEN') continue
            Cookies.delete(name);
        }
    }
}

module.exports = Cookies