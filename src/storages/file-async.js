const pify = require('pify')
const steno = require('steno')
const stringify = require('./_stringify')

module.exports = {
  read: require('./file-sync').read,
  read: async function fileSyncRead (source, deserialize = JSON.parse) {
    if (fs.existsSync(source)) {
      // Read database
      const data = await pify(fs.readFile)(source, 'utf-8')
      const str = data.trim() || '{}'

      try {
        return deserialize(str)
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = `Malformed JSON in file: ${source}\n${e.message}`
        }
        throw e
      }
    } else {
      // Initialize empty database
      await pify(fs.writeFile)(source, '{}')
      return {}
    }
  },
  write: function fileAsyncWrite (dest, obj, serialize = stringify) {
    const data = serialize(obj)
    return pify(steno.writeFile)(dest, data)
  }
}
