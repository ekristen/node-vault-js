# Vault Node.JS Client

A Vault Client implemented in pure javascript (because I strongly dislike CoffeeScript) for https://github.com/hashicorp/vault.

The original code was from https://github.com/kr1sp1n/node-vault, thank you to @kr1sp1n for the work. This code was compiled original from CoffeeScript and then cleaned up and modified to use the `debug` and `request` library.

This library also no longer uses environment variables.

## Install

```
npm install node-vault-js
```

## Example

```javascript
var Vault = require('node-vault-js');
var vault = new Vault({
  endpoint: 'https://vault.private.io:8200'
});

vault.write('auth/github/login', { token: access_token }, function (err, result) {

});
```

## Api

### `Vault([options])`

This module exports a constructor which takes the following options:

* `apiVersion` *(String, optional)* which api version to use, defaults to `'v1'`
* `endpoint` *(String, optional)* vault endpoint of format `'host:port'`, defaults to `'http://127.0.0.1:8200'`
* `token` *(String, optional)* cookie token, defaults to `''`
* `requestOptions` *(Object, optional)* extra request options, defaults to `{}`

### `Vault##write(path, data, cb)`

Writes `data` to `path`.

### `Vault##read(path, cb)`

Reads data from `path`.

### `Vault##delete(path, cb)`

Deletes data stored at `path`.

### `Vault##help(path, cb)`

Gets help for `path`.

## License
MIT
