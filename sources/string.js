'use-strict'

const { compareTwoStrings } = require('string-similarity')
const Math = require('./math')

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
    array = array.map(object => {
        return {
            data: object,
            rating: Math.max(
                ...getElement(object).clean().permutate().map(e => compareTwoStrings(e.clean(), query))
            )
        }
    }).sort((a, b) => b.rating - a.rating)
    return array.map(x => x.data)
}

module.exports = String