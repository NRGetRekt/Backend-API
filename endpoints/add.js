const mongo = require('../handlers/mongo')
const stats = require('../handlers/stats')
const fetch = require('cross-fetch')
const colors = require('colors')

const config = require('../config')

module.exports.admin = true

module.exports.post = async(req, res) => {
    if (!req.body.domain) return res.status(400).json({
        error: 'No domain provided'
    })

    if (!req.body.domain.includes('.')) return res.status(400).json({
        error: 'Invalid domain'
    })

    let domain = req.body.domain

    if (process.localDomains.find(x => domain.endsWith(x.domain))) return res.status(400).json({
        error: 'Domain is already being blocked'
    })

    let entry = {
        domain: domain,
        reason: req.body.reason,
        timestamp: Date.now()
    }

    if (req.body.whitelist) {
        // Whitelist domain
        mongo.insertObject('Whitelist', entry)
        process.whitelist.push(entry)
    } else {
        // Block domain
        mongo.insertObject('BlockedDomains', entry)
        process.localDomains.push(entry)
        stats.set({ domains: stats.get().domains + 1 })
    }

    // Report to Fish Fish
    if (!req.body.whitelist && req.body.forward && config.reportForwardKey) {
        process.log(`Forwarding ${colors.cyan(req.body.forward)} to Fish Fish`)
        fetch('https://yuri.bots.lostluma.dev/phish/report', {
            method: 'POST',
            headers: {
                'Authorization': config.reportForwardKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: req.body.forward,
                reason: req.body.reason
            })
        })
    }

    res.json({
        success: true
    })

}