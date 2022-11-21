//Whitelist Malicious URLs, why would you do that?, Right?

const mongo = require('../handlers/mongo')

module.exports.get = async(req, res) => {

    let list = []

    for (let entry of process.whitelist) {
        list.push({
            domain: entry.domain,
            reason: entry.reason,
            timestamp: entry.timestamp
        })
    }

    res.json(list)

}
