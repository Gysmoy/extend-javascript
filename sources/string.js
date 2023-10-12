'use-strict'

const { compareTwoStrings } = require('string-similarity')
const Math = require('./math')

String.prototype.matchAndCreateObject = function (regex, structure) {
    try {
        let matched = this.match(regex);
        let object = {};

        structure.split(",").forEach((s, i) => {
            object[s.trim()] = matched[i + 1].trim();
        });

        return object;
    } catch (error) {
        return null;
    }
}

String.prototype.split2 = function (separator, { regex, structure } = {}) {
    let array = this.split(separator);

    return array
        .map(e => {
            if (!regex) {
                return e.trim();
            } else {
                return e.trim().matchAndCreateObject(regex, structure);
            }
        })
        .filter(Boolean);
};

String.prototype.toTitleCase = function (capitalizeSingleWords = true) {
    let text = this.toString()
    const lastChar = text.slice(-1)
    if (lastChar === ' ') return text
    text = text.replace(/\b\w/g, l => l.toUpperCase())
    const words = text.split(' ')
    let result = ''
    for (let i = 0; i < words.length; i++) {
        const word = words[i]
        if (word.includes('.')) {
            result += word + ' '
        } else {
            const capitalize = capitalizeSingleWords || word.length > 1
            if (capitalize) {
                result += word.charAt(0) + word.slice(1).toLowerCase() + ' '
            } else {
                result += word.toLowerCase() + ' '
            }
        }
    }
    return result.trim()
}

String.prototype.includesEachOther = function (text) {
    const text1 = this.toString().toLowerCase()
    const text2 = text.toLowerCase()
    return text1.includes(text2) || text2.includes(text1)
}

String.prototype.getAlNum = function (latin = true) {
    let regex = new RegExp('[^a-zA-Z0-9Ññ\\s]', 'g')
    if (!latin) regex = new RegExp('[^a-zA-Z0-9\\s]', 'g')

    return this.toString()
        .replace(regex, '')
        .split(' ')
        .filter(Boolean)
        .join(' ')
}

String.prototype.keep = function (characters) {
    const regex = new RegExp(`[^${characters}]`, 'g')
    return this.toString()
        .replace(regex, '')
        .split(' ')
        .filter(Boolean)
        .join(' ')
}

String.prototype.reduce = function (chars) {
    let text = this.toString()
    if (text.length > chars) {
        text = text.slice(0, chars - 3) + '...'
    }
    return text
}

String.prototype.clean = function (sep = ' ') {
    let text = this.toString()

    const especial_chars = [
        'Ã', 'À', 'Á', 'Ä', 'Â',
        'Ẽ', 'È', 'É', 'Ë', 'Ê',
        'Ĩ', 'Ì', 'Í', 'Ï', 'Î',
        'Õ', 'Ò', 'Ó', 'Ö', 'Ô',
        'Ũ', 'Ù', 'Ú', 'Ü', 'Û',
        'Ñ', 'Ç'
    ]
    const normal_chars = [
        'A', 'A', 'A', 'A', 'A',
        'E', 'E', 'E', 'E', 'E',
        'I', 'I', 'I', 'I', 'I',
        'O', 'O', 'O', 'O', 'O',
        'U', 'U', 'U', 'U', 'U',
        'N', 'C'
    ]
    text = text.toUpperCase()
    text = text.replace(/[^A-Z0-9 ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛÑÇ]/gi, '')
    for (let i = 0; i < especial_chars.length; i++) {
        text = text.replaceAll(especial_chars[i], normal_chars[i])
    }
    const clean = text.split(' ').filter(Boolean).join(sep)
    return clean
}

String.prototype.permutate = function (separator = ' ') {
    const text = this.toString()
    const words = text.split(separator);
    const permutaciones = [];

    const generarCombinaciones = (prefix, leftWords) => {
        if (leftWords.length === 0) {
            permutaciones.push(prefix);
        } else {
            generarCombinaciones(prefix + separator + leftWords[0], leftWords.slice(1));
            generarCombinaciones(prefix, leftWords.slice(1));
        }
    }

    words.forEach((word, i) => {
        generarCombinaciones(word, words.slice(i + 1));
    })

    return permutaciones;
}

String.prototype.sortByComparison = function (array, getElement = (x) => x) {
    let query = this.toString()
    array = array.map(data => {
        const rating = Math.max(
            ...getElement(data).clean().permutate().map(e => compareTwoStrings(e.clean(), query.clean()))
        )
        if (rating > 0) {
            return { data, rating }
        } else return
    }).filter(Boolean).sort((a, b) => b.rating - a.rating)
    return array.map(x => x.data)
}



module.exports = String