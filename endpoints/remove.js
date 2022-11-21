const mongo = require('../handlers/mongo')
const stats = require('../handlers/stats')

module.exports.admin = true

module.exports.post = async(req, res) => {
    if (!req.body.domain) return res.status(400).json({
        error: 'No domain provided'
    })

    // Parse out root domain (without subdomains)
    // I know this is sketchy, but it works, so leave me alone
    let domain = req.body.domain.split('.')
    domain = domain[domain.length - 2] + '.' + domain[domain.length - 1]

    if (!process.localDomains.find(x => domain.endsWith(x.domain))) return res.status(400).json({
        error: 'Domain is not being blocked'
    })

    // Remove from database
    mongo.delete('BlockedDomains', { domain: req.body.domain })

    // Remove from domain cache
    process.localDomains = process.localDomains.filter(x => x.domain != domain)

    stats.set({ domains: stats.get().domains - 1 })

    res.json({
        success: true
    })

}