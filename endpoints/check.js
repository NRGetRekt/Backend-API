const stats = require('../handlers/stats')
const colors = require('colors')

module.exports.get = async(req, res) => {
    if (!req.query.domain) return res.status(400).json({
        error: 'No domain provided'
    })

    stats.set({ checks: stats.get().checks + 1 })

    let domain = req.query.domain.toLowerCase()

    process.log(`Checking ${colors.cyan(domain)}`)

    let currentStats = stats.get()

    // Check local domains
    let localEntry = process.localDomains.find(x => domain == x.domain || domain.endsWith('.' + x.domain))
    if (localEntry) {

        currentStats.detections += 1
        if (!currentStats.detectionList[domain]) currentStats.detectionList[domain] = 0
        currentStats.detectionList[domain] += 1
        stats.set({ detections: currentStats.detections, detectionList: currentStats.detectionList })

        res.json({
            blocked: true,
            reason: localEntry.reason || 'Not provided',
            timestamp: localEntry.timestamp
        })
    } else if (process.externalDomains.find(x => domain == x || domain.endsWith('.' + x))) { // Check external domains

        currentStats.detections += 1
        if (!currentStats.detectionList[domain]) currentStats.detectionList[domain] = 0
        currentStats.detectionList[domain] += 1
        stats.set({ detections: currentStats.detections, detectionList: currentStats.detectionList })

        res.json({
            blocked: true,
            reason: 'Checked externally [phish.sinking.yachts]'
        })
    } else {
        // All checks passed
        res.json({
            blocked: false
        })
    }

}