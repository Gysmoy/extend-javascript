'use-strict'

JSON.parseable = (text) => {
    try {
        let json = JSON.parse(text);
        return json;
    } catch (error) {
        return false;
    }
};

JSON.flatten = (obj, notation = '.', prefix = '', flattenLastArray = true) => {
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

JSON.unflatten = (obj, notation = '.') => {
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

JSON.take = (obj, quantity) => {
    return obj.slice(0, quantity);
}

module.exports = JSON