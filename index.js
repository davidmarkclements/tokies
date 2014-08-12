var jwt = require('jwt-simple');
var qs = require('querystring');

function Tokens(req, res, secret) {
  if (!(this instanceof Tokens)) { return new Tokens(req, res); }
  this.request = req;
  this.response = res;
  this.payload = {};
  this._secret = secret || '53C237'
}

Tokens.prototype = {
  constructor: Tokens,
  get: function(name) {
    if (!this.payload) { return; }
    return this.payload[name];
  },

  set: function(name, value) {
    if (!this.payload) { throw Error('payload is not available'); }
    if (typeof value === 'undefined') { return this.clear(name);}
    this.payload[name] = value;
    return this;
  },

  clear: function (name) {
    if (!this.payload[name]) {return;}
    this.payload = null;
  },

  decode: function (hash) {
    this.payload = jwt.decode(hash, this._secret);
    return this.payload;
  },

  encode: function () {
    var hash = jwt.encode(this.payload, this._secret);
    this.payload = null;
    return hash;
  }
}

Tokens.middleware = function (opts) {
  return function (req, res, next) {
    var tokens = opts.tokens, path, encoded;
    if (!tokens && Array.isArray(opts.path)) {
      path = opts.path.slice();
      tokens = req;
      while (path.length && (tokens = tokens[path.shift()]));
    }
    encoded = req.headers.authorization && req.headers.authorization.replace(/bearer /i, '');
    encoded = encoded || opts.key && qs.parse(req.url.split('?')[1])[opts.key];
    if (!encoded || !tokens || tokens.payroll) { return next && next(); }
    tokens.decode(encoded);
    next && next();
  }
}

module.exports = Tokens;