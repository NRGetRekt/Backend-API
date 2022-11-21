const mongo = require('./mongo')
const ms = require('ms')

var stats = {
    detections: 0,
    checks: 0,
    domains: 0,
    detectionList: {}
}

async function save() {
    mongo.update('Misc', { name: 'Stats' }, { value: stats }, () => { process.log('Stats saved') })
}

async function load() {
    mongo.query('Misc', { name: 'Stats' }, res => {
        if (!res[0]) return mongo.insertObject('Misc', {
            name: 'Stats',
            value: stats
        })

        for (key in res[0].value) {
            if (key != 'domains') stats[key] = res[0].value[key]
        }

    })
}

async function init() {

    await load()

    setInterval(save, ms('1m'))

}

function get() {
    return stats
}

function set(update) {
    for (key in update) {
        stats[key] = update[key]
    }
}

module.exports = {
    save,
    load,
    init,
    get,
    set
}