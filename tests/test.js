const assert = require('assert');
const request = require('supertest');
const app=require("../server.js").app;
var req=null;

before(function() {
    req = request('http://localhost:8080');
});

describe('Test products API', function() {
    it('products service should be healthy', function(done) {
       req
        .get('/healthz')
        .expect('OK', done);
    });
    it('products service should be return more than 1 products', function(done) {
       req
        .get('/store')
        .expect(200)
        .then(response => {
          assert.equal(response.body.length>0,true);
          done();
        })
    });
});

after(function() {
    process.exit();
});
