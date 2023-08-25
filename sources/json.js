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

JSON.fromCSV = function (csv, separator = ',', headers_pos = 0) {
    const lines = csv.trim().split("\n");
    const headers = lines[headers_pos].split(separator);
    const result = [];
    for (let i = (headers_pos + 1); i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(separator);
        let cursor = 0;
        if (!currentLine.every(c => c === "")) { // Validar si la fila está vacía
            for (let j = 0; j < headers.length; j++) {
                if (currentLine[cursor].startsWith('"')) {
                    let field = currentLine[cursor].substring(1);

                    while (!currentLine[cursor].endsWith('"')) {
                        cursor++;
                        field += `${separator}${currentLine[cursor]}`;
                    }
                    obj[headers[j]] = field.slice(0, -1);
                } else {
                    obj[headers[j]] = currentLine[cursor];
                }
                cursor++;
            }
            result.push(obj);
        }
    }
    return result;
}

module.exports = JSON