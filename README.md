# Hooks (Mapping) Webpack Plugin
Tapable hooks is flexible to work as a callback pattern. But unfortunately, when we want to quickly attach a simple action to a compiler or compilation hook, especially directly in webpack.config.js, it's not so convenient.
The solution of this plugin is provide a compact naming convention to map both compiler and compilation hooks in a flat options object, for example:
```js
const options = {
  // a sync compiler hook
  beforeRun: (compiler) => {
    // ...
  },
  // An ending '@' is indicating a call to tapAsync
  'done@': (compiler, callback) => {
    // ...
    callback() // notify webpack the action is completed now.
  },
  // A leading '$' is indicating this is a compilation hook.
  $succeedModule: (module) => {
    // ...
  },
  // An ending '?' indicating a call to tapPromise.
  '$additionalAssets?': () => new Promise((resolve, reject) => {
    doSomeAwesomeWork()
      .then((result) => {
        // ...
        resolve(result)
      })
      .catch((err) => {
        // ...
        reject(err)
      })
  })),
  // or use the async/await version
  '$optimizeAssets?': async () => {
    try {
      var result = await doSomeAwesomeWork()
      // ...
      return result
    } catch(err) {
      // ...
      throw err
    }
  })
}
```

***compatibility***
This plugin only supports the hooks operations. So it does not work with (very) old versions of webpack.

## Installation
```shell
npm i -D hooks-webpack-plugin
```

## Example Code
You can put it in webpack.config.js, or anywhere you prefer.
```js
const HooksPlugin = require('hooks-webpack-plugin')

const doSomeAwesomeWork = new HooksPlugin({
  beforeRun: (compiler) => {
    console.log('---- beforeRun ----')
  },
  'done@': (compiler, callback) => {
    console.log('---- packing is done! ----')
    callback()
  },
})

const config = {
  // ...
  plugins: [
    doSomeAwesomeWork,
    // ...
  ],
  // ...
}
```

## Available Hooks
please refer to webpack's documentation.
### [Compiler Hooks](https://webpack.js.org/api/compiler-hooks)
### [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)

## Bugs & Pull Requests
You are welcome to report bugs, give suggestions and contributions. Cheers.

## License
This project is [licensed](LICENSE.md) under the [MIT](https://opensource.org/licenses/MIT) license.
