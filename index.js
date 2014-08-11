function Tokens(req, res) {
  
}


Tokens.prototype = {
  constructor: Tokens,
  get: function(name, opts) {
    var sigName = name + ".sig"
      , header, match, value, remote, data, index
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    header = this.request.headers["cookie"]
    if (!header) return

    match = header.match(getPattern(name))
    if (!match) return

    value = match[1]
    if (!opts || !signed) return value

    remote = this.get(sigName)
    if (!remote) return

    data = name + "=" + value
    if (!this.keys) throw new Error('.keys required for signed cookies');
    index = this.keys.index(data, remote)

    if (index < 0) {
      this.set(sigName, null, {path: "/", signed: false })
    } else {
      index && this.set(sigName, this.keys.sign(data), { signed: false })
      return value
    }
  },

  set: function(name, value, opts) {
    var res = this.response
      , req = this.request
      , headers = res.getHeader("Set-Cookie") || []
      , secure = req.connection.encrypted
      , cookie = new Cookie(name, value, opts)
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    if (typeof headers == "string") headers = [headers]

    if (!secure && opts && opts.secure) throw new Error("Cannot send secure cookie over unencrypted socket")

    cookie.secure = secure
    if (opts && "secure" in opts) cookie.secure = opts.secure
    if (opts && "secureProxy" in opts) cookie.secure = opts.secureProxy
    headers = pushCookie(headers, cookie)

    if (opts && signed) {
      if (!this.keys) throw new Error('.keys required for signed cookies');
      cookie.value = this.keys.sign(cookie.toString())
      cookie.name += ".sig"
      headers = pushCookie(headers, cookie)
    }

    var setHeader = res.set ? http.OutgoingMessage.prototype.setHeader : res.setHeader
    setHeader.call(res, 'Set-Cookie', headers)
    return this
  }
}


module.exports = Tokens;
