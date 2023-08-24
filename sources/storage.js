'use-strict'

const { AES, enc } = require("crypto-js");

/**
 * La clase `Local` proporciona métodos para administrar datos en el almacenamiento local,
 * rastreando sus tipos.
 * 
 * @author SoDe World
 * @version 3.1.1
 * @license Todos los derechos reservados.
 */
class Local {
    /**
     * Almacén de almacenamiento local.
     * @type {Storage}
     */
    static storage = localStorage;

    static #hash = 'cff54ba3-d685-481c-9fb6-a2e5e9f78a4d'

    /**
     * Registro de los tipos de datos almacenados.
     * @type {Object.<string, string>}
     */
    static storage_types = {};

    /**
     * Tamaño máximo de fragmento en bytes para dividir los datos.
     * @type {number}
     * @private
     */
    static #MAX_CHUNK_SIZE = 4.5 * 1024 * 1024; // 4.5 MB en bytes

    /**
     * Calcula el tamaño en bytes de una cadena.
     * @param {string} string - La cadena de entrada.
     * @returns {number} - Tamaño en bytes de la cadena.
     * @private
     */
    static #bytesize(string) {
        const encoder = new TextEncoder();
        return encoder.encode(string).length;
    }

    /**
     * Divide una cadena en fragmentos más pequeños según el tamaño máximo.
     * @param {string} string - La cadena a dividir.
     * @returns {string[]} - Fragmentos de la cadena dividida.
     * @private
     */
    static #partition(string) {
        const chunks = [];
        let currentIndex = 0;
        while (currentIndex < string.length) {
            const remainingText = string.slice(currentIndex);
            const chunkSize = Math.min(this.#MAX_CHUNK_SIZE, remainingText.length);
            let chunk = remainingText.slice(0, chunkSize);
            while (this.#bytesize(chunk) > this.#MAX_CHUNK_SIZE) {
                chunk = chunk.slice(0, chunk.length - 1);
            }
            chunks.push(chunk);
            currentIndex += chunk.length;
        }
        return chunks;
    }

    /**
     * Obtiene todas las claves únicas almacenadas en el almacenamiento.
     * @returns {string[]} - Lista de claves únicas.
     * @private
     */
    static #keys() {
        return [...new Set(Object.keys(this.storage).map(key => {
            const coincidences = key.match(/^(.*?)\[/)
            if (coincidences) return coincidences[1]
            else return key
        }))];
    }

    /**
     * Almacena un valor en el almacenamiento local junto con su tipo.
     * @param {string} name - El nombre de la clave en el almacenamiento local.
     * @param {*} value - El valor que se almacenará. Se convierte a JSON antes de guardar.
     */
    static set(name, value) {
        this.delete(name)
        const value2save = AES.encrypt(JSON.stringify(value), this.#hash).toString();
        this.storage_types[name] = typeof value;
        if (this.#bytesize(value2save) > this.#MAX_CHUNK_SIZE) {
            let parts = this.#partition(value2save);
            parts.forEach((part, i) => {
                this.storage.setItem(`${name}[${i}]`, part);
            });
        } else {
            this.storage.setItem(name, value2save);
        }
        this.saveStorageTypes();
    }

    /**
     * Obtiene un valor del almacenamiento local y lo decodifica.
     * @param {string} name - El nombre de la clave en el almacenamiento local.
     * @returns {string} - Valor decodificado.
     * @private
     */
    static #get(name) {
        let keys = Object.keys(this.storage).map(key => {
            if (key === name) return {
                position: 0,
                value: this.storage.getItem(name)
            };
            else if (key.startsWith(`${name}[`)) return {
                position: key.replace(/.*\[(\d+)\]/, '$1'),
                value: this.storage.getItem(key)
            };
        }).filter(Boolean);
        let values = keys.sort((a, b) => a.position - b.position).map(x => x.value);
        return values.join('');
    }

    /**
     * Recupera un valor del almacenamiento local, convirtiéndolo al tipo adecuado.
     * @param {string} name - El nombre de la clave en el almacenamiento local.
     * @returns {*} - El valor almacenado en el tipo correspondiente.
     */
    static get(name) {
        if (!this.#keys().includes(name)) return;
        let valueencoded = this.#get(name);
        let valuedecoded;
        try {
            valuedecoded = AES.decrypt(valueencoded, this.#hash).toString(enc.Utf8);
        } catch (e) { }
        const value = JSON.parse(valuedecoded);
        const type = this.storage_types[name];
        switch (type) {
            case "boolean":
                return Boolean(value);
            case "number":
                return Number(value);
            case "string":
                return String(value);
            case "object":
                return value;
            default:
                return value;
        }
    }

    /**
     * Recupera todos los pares clave-valor del almacenamiento local como un objeto.
     * @returns {Object} - Objeto que contiene todos los pares clave-valor almacenados.
     */
    static getAll() {
        const result = {};
        this.#keys().forEach(key => {
            if (key !== 'storage_types') {
                const value = this.get(key);
                result[key] = value;
            }
        });
        return result;
    }

    /**
     * Elimina un elemento del almacenamiento local y su tipo asociado.
     * @param {string} name - El nombre de la clave en el almacenamiento local.
     */
    static delete(name) {
        Object.keys(this.storage).forEach(key => {
            if (
                key === name ||
                key.startsWith(`${name}[`)
            ) this.storage.removeItem(key)
        })
        delete this.storage_types[name];
        this.saveStorageTypes();
    }

    /**
     * Limpia todo el almacenamiento local y los tipos asociados.
     */
    static destroy() {
        this.storage.clear();
        this.storage_types = {};
        this.saveStorageTypes();
    }

    /**
     * Guarda los tipos de almacenamiento local en el almacenamiento local del navegador.
     */
    static saveStorageTypes() {
        this.storage.setItem("storage_types", JSON.stringify(this.storage_types));
    }
}

/**
 * La clase `Session` extiende la clase `Local` para trabajar con el almacenamiento de sesión.
 */
class Session extends Local {
    /**
     * Almacén de almacenamiento de sesión.
     * @type {Storage}
     */
    static storage = sessionStorage;
}

// Cargar los tipos de almacenamiento previamente guardados en el almacenamiento local y de sesión.
Local.storage_types = JSON.parse(localStorage.getItem("storage_types")) || {};
Session.storage_types = JSON.parse(sessionStorage.getItem("storage_types")) || {};

module.exports = { Local, Session }