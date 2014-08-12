var Tokens = require('..');
var assert = require('assert');
var jwt = require('jwt-simple');
var secret = 'test';
var tokens = new Tokens({}, {}, secret);
var test = {foo: 'a'};

tokens.set('foo', test.foo);

try {
  assert.equal(tokens.encode(), jwt.encode(test, secret));	
} catch (e) {
  console.log('\n ===FAIL===\n\n', e, '\n')
  return;
}
console.log('\n ===PASS===\n')