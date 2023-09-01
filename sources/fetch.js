const JSON = require('./json')

const FetchParams = {}

const Fetch = async (url, params = {}) => {
    try {
        const res = await fetch(url, Object.assign(FetchParams, params))
        const raw = await res.text()

        if (!res.ok) return {
            status: false,
            result: JSON.parseable(raw) || raw
        }
        return {
            status: true,
            result: JSON.parseable(raw) || raw
        }
    } catch (error) {
        return {
            status: false,
            result: null
        }
    }
}

module.exports = { FetchParams, Fetch }