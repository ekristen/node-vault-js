# Vault Node.JS Client

A Vault Client implemented in pure javascript (because I detest CoffeeScript) for https://github.com/hashicorp/vault.

The original code was from https://github.com/kr1sp1n/node-vault, thank you to @kr1sp1n for the work. This code was compiled original from CoffeeScript and then cleaned up and modified to use the `debug` and `request` library.

This library also no longer uses environment variables.

## Install

```
npm install node-vault-js
```

## Example

```javascript
var vault = new VaultAPI({
  endpoint: 'https://vault.private.io:8200',
});

vault.write('auth/github/login', { token: access_token }, function(err, result) {

});
```

## Documentation

Coming Soon
