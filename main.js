const Clipboard = require('./sources/clipboard')
const Cookies = require('./sources/cookies')
const GET = require('./sources/get')
const JSON = require('./sources/json')
const Math = require('./sources/math')
const String = require('./sources/string')
const Notify = require('./sources/notify')
const storage = require('./sources/storage')
const _fetch = require('./sources/fetch')

module.exports = {
    Local: storage.Local,
    Session: storage.Session,
    Cookies,
    Notify,
    GET,
    JSON,
    Math,
    Clipboard,
    FetchParams: _fetch.FetchParams,
    Fetch: _fetch.Fetch,
    String
}