const assert = require('assert');
const request = require('supertest');
const app=require("../server.js").app;
var req=null;

before(function() {
    console.log('before')
    req = request('http://localhost:8080');
});
describe('Array', function() {
    it('should return -1 when the value is not present', function(done) {
       req
        .get('/healthz')
        .expect('OK', done);
    });
});
after(function() {
    console.log('after')
    process.exit();
});
