const Clipboard = require('./sources/clipboard')
const Cookies = require('./sources/cookies')
const GET = require('./sources/get')
const JSON = require('./sources/json')
const Math = require('./sources/math')
const Notify = require('./sources/notify')
const storage = require('./sources/storage')

module.exports = {
    Local: storage.Local,
    Session: storage.Session,
    Cookies,
    Notify,
    GET,
    JSON,
    Math,
    Clipboard
}