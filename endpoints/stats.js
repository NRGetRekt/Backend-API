const stats = require('../handlers/stats')

module.exports.get = async(req, res) => {
    res.json(stats.get())
}