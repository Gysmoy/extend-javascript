'use-strict'

JSON.parseable = function (text) {
    try {
        let json = JSON.parse(text);
        return json;
    } catch (error) {
        return false;
    }
};

JSON.flatten = function (obj, notation = '.', prefix = '', flattenLastArray = true) {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + notation : '';
        if (Array.isArray(obj[k])) {
            if (flattenLastArray && typeof obj[k][0] !== 'object') {
                obj[k].forEach((item, i) => {
                    acc[`${pre}${k}[${i}]`] = item;
                });
            } else {
                acc[pre + k] = obj[k];
            }
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, JSON.flatten(obj[k], notation, pre + k, flattenLastArray));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

JSON.unflatten = function (obj, notation = '.') {
    let result = {};
    for (let key in obj) {
        let keys = key.split(notation);
        let cur = result;
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i];
            let isArray = false;
            if (prop.includes('[') && prop.endsWith(']')) {
                let index = parseInt(prop.slice(prop.indexOf('[') + 1, prop.length - 1));
                prop = prop.slice(0, prop.indexOf('['));
                if (!cur[prop]) {
                    cur[prop] = [];
                }
                isArray = true;
                while (cur[prop].length < index) {
                    cur[prop].push({});
                }
                if (i === keys.length - 1) {
                    cur[prop][index] = obj[key];
                } else {
                    if (!cur[prop][index]) {
                        cur[prop][index] = {};
                    }
                    cur = cur[prop][index];
                }
            } else {
                if (i === keys.length - 1) {
                    cur[prop] = obj[key];
                } else {
                    if (!cur[prop]) {
                        cur[prop] = {};
                    }
                    cur = cur[prop];
                }
            }
        }
    }
    return result;
}

JSON.take = function (obj, quantity) {
    return obj.slice(0, quantity);
}

JSON.fromCSV = function (csv, separator = ',') {
    const lineas = String(csv).trim().split('\n');
    const resultado = [];
    const encabezados = lineas[0].split(separator).map(item => item.trim());

    const regexp = new RegExp(`${separator}(?=(?:(?:[^"]*"){2})*[^"]*$)`)

    for (let i = 1; i < lineas.length; i++) {
        const obj = {};
        
        const filaActual = lineas[i].split(regexp)
            .map(item => item.trim().replace(/^"(.*)"$/, '$1'));

        for (let j = 0; j < encabezados.length; j++) {
            obj[encabezados[j]] = filaActual[j];
        }

        resultado.push(obj);
    }

    return resultado;
}

module.exports = JSON