const config = require('../config.js')
const fetch = require('cross-fetch')
const extractUrls = require("extract-urls");

module.exports.post = async(req, res) => {

    if (!req.body.url) return res.status(400).json({
        error: 'No URL provided'
    })

    if (!req.body.user) return res.status(400).json({
        error: 'No user provided | If not reporting through Discord, please provide something identifying'
    })

    let URLs = extractUrls(req.body.url)

    if (!URLs || !URLs[0]) return res.status(400).json({
        error: 'Invalid URL'
    })

    // Send WebHook with embed to specified Discord channel
    fetch(config.reporthook, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "embeds": [{
                "title": "New Report",
                "description": URLs[0],
                "color": 255,
                "timestamp": new Date().toISOString(),
                "author": {
                    "name": req.body.user || 'Unknown'
                }
            }]
        })
    })

    res.json({
        success: true
    })

}