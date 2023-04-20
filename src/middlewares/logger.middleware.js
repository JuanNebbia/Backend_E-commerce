const { devLogger, prodLogger } = require('../utils/logger.js')

const addLogger = (req, res, next) =>{
    req.logger = devLogger
    next()
}

module.exports = addLogger