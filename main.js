const Cookies = require('./sources/cookies')
const Notify = require('./sources/notify')
const storage = require('./sources/storage')
const GET = require('./sources/get')
const JSON = require('./sources/json')

module.exports = {
    Local: storage.Local,
    Session: storage.Session,
    Cookies,
    Notify,
    GET,
    JSON
}