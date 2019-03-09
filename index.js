module.exports = HooksWebpackPlugin

function HooksWebpackPlugin (options) {
  this.compiler = {}
  this.compilation = {}
  for (var key in options) {
    key.startsWith('$')
      ? this.compilation[key.substring(1)] = options[key]
      : this.compiler[key] = options[key]
  }
}

function tapHook (context, scope, name) {
  function error (reason) {
    throw new Error('[hooks-webpack-plugin] ' + scope + ':' + name + reason)
  }

  var callback = this[scope][name]
  if (!callback) {
    return // allow and ignore a falsy value
  }
  if (typeof callback !== 'function') {
    return error("'s callback is not a function.")
  }

  var action = name.endsWith('@') ? 'tapAsync'
    : name.endsWith('?') ? 'tapPromise'
      : 'tap' // default
  if (action !== 'tap') {
    name = name.substring(0, name.length - 1)
  }
  var hook = context.hooks[name]
  hook ? hook[action]('hooks-webpack-plugin', callback)
    : error(' is not a valid hook.')
}

HooksWebpackPlugin.prototype.apply = function (compiler) {
  var tap = tapHook.bind(this, compiler, 'compiler')
  var compilationHook = null
  for (var key in this.compiler) {
    if (key !== 'compilation') {
      tap(key)
    } else {
      compilationHook = this.compiler[key]
      if (compilationHook && typeof compilationHook !== 'function') {
        throw new Error(
          "[hooks-webpack-plugin] compiler:compilation's callback is not a function."
        )
      }
    }
  }
  compiler.hooks.compilation.tap('hooks-webpack-plugin', function (compilation) {
    compilationHook && compilationHook(compilation)
    var tap = tapHook.bind(this, compilation, 'compilation')
    for (var key in this.compilation) {
      tap(key)
    }
  }.bind(this))
}
