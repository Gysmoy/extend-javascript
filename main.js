const Cookies = require('./sources/cookies')
const Notify = require('./sources/notify')
const storage = require('./sources/storage')

module.exports = {
    Local: storage.Local,
    Session: storage.Session,
    Cookies: Cookies,
    Notify: Notify
}