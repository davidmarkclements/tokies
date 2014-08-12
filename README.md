# Tokies

A (https://www.npmjs.org/package/cookies) [cookies] mimicking API for
JSON Web Tokens (hash tokens that can be decoded to an object)

See (https://www.npmjs.org/package/jwt-simple) [jwt-simple module]

## API

```
var Tokies = require('tokies');
var tokens = new Tokies(request, response, secret)
```

This creates a tokens jar corresponding to the current request and response,
the secret is important for creating unique hashes on your server (if someone
has this secret they can decode your users tokens - which is bad)

```
tokens.get(name)
```

Returns a value from the payload of a token (e.g. any values that have been set), will return undefined if the token has been encoded.

```
tokens.set(name, [value])
```
Sets a value on the tokens payload, if called without a value it mimics
the cookies API and clears the key from the store. For better semantics,
the `clear` method is also supplied.

```
tokens.payload
```

A pseudo private value (available mainly for inspection purposes mainly)
The object containing the keys and values is known as the payload. 

```
tokens.encode()
```
Returns a token hash of the payload, clears the internal payload object. 
At this point the `tokens` is an unusable shell, until decode is called
with a token hash.

```
tokens.decode(hash)
```
Populates the internal payload by decoding the hash into an object, 
at this point .get and .set can be used again.

```
tokens.clear(name)
```
Clears a value from the store.




