const crypro = require('crypto')

const encodeFunction = {
    encrypt: (algorithm, content) => {
        let hash = crypro.createHash(algorithm)
        hash.update(content)
        return hash.digest('hex')
    }
}

module.exports = encodeFunction