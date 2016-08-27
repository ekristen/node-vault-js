var debug = require('debug')('vault');
var xtend = require('xtend');
var request = require('request');
var mustache = require('mustache');

function Vault (opts) {
  if (!(this instanceof Vault)) {
    return new Vault(opts);
  }

  this.commands = {
    status: {
      method: 'GET',
      path: '/sys/seal-status'
    },
    initialized: {
      method: 'GET',
      path: '/sys/init'
    },
    init: {
      method: 'PUT',
      path: '/sys/init'
    },
    unseal: {
      method: 'PUT',
      path: '/sys/unseal'
    },
    seal: {
      method: 'PUT',
      path: '/sys/seal'
    },
    mounts: {
      method: 'GET',
      path: '/sys/mounts'
    },
    mount: {
      method: 'POST',
      path: '/sys/mounts/{{mount_point}}'
    },
    unmount: {
      method: 'DELETE',
      path: '/sys/mounts/{{mount_point}}'
    },
    remount: {
      method: 'POST',
      path: '/sys/remount'
    },
    policies: {
      method: 'GET',
      path: '/sys/policy'
    },
    addPolicy: {
      method: 'PUT',
      path: '/sys/policy/{{name}}'
    },
    removePolicy: {
      method: 'DELETE',
      path: '/sys/policy/{{name}}'
    },
    auths: {
      method: 'GET',
      path: '/sys/auth'
    },
    enableAuth: {
      method: 'POST',
      path: '/sys/auth/{{mount_point}}'
    },
    disableAuth: {
      method: 'DELETE',
      path: '/sys/auth/{{mount_point}}'
    },
    audits: {
      method: 'GET',
      path: '/sys/audit'
    },
    enableAudit: {
      method: 'PUT',
      path: '/sys/audit/{{name}}'
    },
    disableAudit: {
      method: 'DELETE',
      path: '/sys/audit/{{name}}'
    },
    renew: {
      method: 'PUT',
      path: '/sys/renew/{{lease_id}}'
    },
    revoke: {
      method: 'PUT',
      path: '/sys/revoke/{{lease_id}}'
    },
    revokePrefix: {
      method: 'PUT',
      path: '/sys/revoke-prefix/{{path_prefix}}'
    }
  };

  var k, v;
  if (opts == null) {
    opts = {};
  }

  this.apiVersion = opts.apiVersion || 'v1';
  this.endpoint = opts.endpoint || 'http://127.0.0.1:8200';
  this.token = opts.token || '';
  this.requestOptions = opts.requestOptions || {};

  for (k in this.commands) {
    v = this.commands[k];
    this._generate(k, v);
  }
}

Vault.prototype.help = function(path, done) {
  debug("help for " + path);
  return this._request('GET', '/' + path + '?help=1', null, handleResponse(done));
};

Vault.prototype.write = function(path, data, done) {
  debug("write " + path);
  return this._request('PUT', '/' + path, data, handleResponse(done));
};

Vault.prototype.read = function(path, done) {
  debug("read " + path);
  return this._request('GET', '/' + path, null, handleResponse(done));
};

Vault.prototype["delete"] = function(path, done) {
  debug("delete " + path);
  return this._request('DELETE', '/' + path, null, handleResponse(done));
};

Vault.prototype._generate = function(name, opts) {
  return this[name] = function() {
    var done, params;
    debug("" + name);
    params = arguments[0], done = arguments[1];
    if (typeof params === 'function') {
      done = params;
      params = null;
    }
    return this._request(opts.method, opts.path, params, handleResponse(done));
  };
};

function handleResponse (done) {
  return function (err, res, body) {
    if (err) {
      debug(err);
    }
    if (err) {
      return done(err);
    }
    if ((body != null ? body.errors : void 0) != null) {
      err = new Error(body.errors[0]);
    }
    if (err) {
      return done(err);
    }
    return done(null, body);
  };
}

Vault.prototype._request = function(method, path, data, done) {
  if (data != null) {
    debug(data);
  }

  var uri = this.endpoint + '/' + this.apiVersion + path;
  uri = mustache.render(uri, data);
  uri = uri.replace(/&#x2F;/g, '/');

  debug(method + " " + uri);

  var requestOptions = xtend({
    method: method,
    json: data,
    uri: uri,
    followRedirects: true,
    followAllRedirects: true,
    headers: {
      'X-Vault-Token': this.token
    }
  }, this.requestOptions)

  debug('requestOptions: %j', requestOptions)

  return request(requestOptions, function(err, res, body) {
    if (err) {
      debug(err);
      return done(err);
    }

    debug('headers: %j', res.headers)
    debug("RES " + res.statusCode);

    if (body) {
      if (typeof body !== 'object') {
        body = JSON.parse(body);
      }
      debug(body);
    }

    return done(err, res, body);
  });
};


module.exports = Vault;
