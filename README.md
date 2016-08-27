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
  endpoint: 'https://vault.private.io:8200',
  token: access_token
});

vault.write('secret/hello', { value: 'world', lease: '1s' }, function(err, result) {
  if (err) {
    throw err
  }
  console.log('Wrote with response: ', result)

  vault.read('secret/hello', function(err, result) {
    if (err) {
      throw err
    }
    console.log('Read with response: ', result)

    vault.delete('secret/hello', function(err, result) {
    if (err) {
      throw err
    }
    console.log('Deleted with response: ', result)

    });
  });
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

## Auth

Don't forget to authenticate with the vault server before you do any operations
that need an access token. Here is an easy example using the request module.

``` javascript
  var url = require('url')
  var request = require('request')

  function authenticateVault (vaultURL, appId, userId, callback) {
    var vaultLogin = url.resolve(vaultURL, '/v1/auth/app-id/login')
    var opts = {
      url: vaultLogin,
      body: {
        app_id: appId,
        user_id: userId
      },
      json: true
    }
    request.post(opts, function (err, res, body) {
      if (err) {
        return callback(err)
      }

      callback(null, body.auth.client_token)
    })
  }
```


## License
MIT
