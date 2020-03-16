const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Cap APIs', () => {
  let cap = {
    userId: 'userId',
    name: 'cap1',
    productId: 'productId',
    price: 213,
    alcohol: 10
  };

  describe('# POST /api/caps', () => {
    it('should create a new cap', (done) => {
      request(app)
        .post('/api/caps')
        .send(cap)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.userId).to.equal(cap.userId);
          expect(res.body.name).to.equal(cap.name);
          expect(res.body.price).to.equal(cap.price);
          expect(res.body.productId).to.equal(cap.productId);
          expect(res.body.alcohol).to.equal(cap.alcohol);
          cap = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/caps/:capId', () => {
    it('should get cap details', (done) => {
      request(app)
        .get(`/api/caps/${cap._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
            expect(res.body.userId).to.equal(cap.userId);
            expect(res.body.name).to.equal(cap.name);
            expect(res.body.price).to.equal(cap.price);
            expect(res.body.productId).to.equal(cap.productId);
            expect(res.body.alcohol).to.equal(cap.alcohol);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when cap does not exists', (done) => {
      request(app)
        .get('/api/caps/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/caps/:capId', () => {
    it('should update cap details', (done) => {
      cap.name = 'KK';
      request(app)
        .put(`/api/caps/${cap._id}`)
        .send(cap)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK');
          expect(res.body.userId).to.equal(cap.userId);
          expect(res.body.price).to.equal(cap.price);
          expect(res.body.productId).to.equal(cap.productId);
          expect(res.body.alcohol).to.equal(cap.alcohol);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/caps/', () => {
    it('should get all caps', (done) => {
      request(app)
        .get('/api/caps')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all caps (with limit and skip)', (done) => {
      request(app)
        .get('/api/caps')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/caps/', () => {
    it('should delete cap', (done) => {
      request(app)
        .delete(`/api/caps/${cap._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK');
          expect(res.body.userId).to.equal(cap.userId);
          expect(res.body.price).to.equal(cap.price);
          expect(res.body.productId).to.equal(cap.productId);
          expect(res.body.alcohol).to.equal(cap.alcohol);
          done();
        })
        .catch(done);
    });
  });
});
