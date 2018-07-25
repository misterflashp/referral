let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let server = require('../../server');
//testing referrance address : 0xa3f1592d8a09a91a7238f608620ffde7c4b26029
let expect = chai.expect;
let should = chai.should();


let validAddresss = {
  'address': '0xa3f1592d8a09a91a7238f608620ffde7c4b26029'
}
//claimBonus endpoint
describe('Route ', () => {
  describe('/POST ', () => {

    it('With valid client address should return status', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .post('/referral/claim')
        .send(validAddresss)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('Object');
          res.should.have.property('status');
          //console.log(res.text);
          done();
        });
    }).timeout(5000);
  });
});


///**  getReferralInfo endpoint
describe('Route addReferral', () => {
  describe('/GET ', () => {

    it('With valid client address should return an object ', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .get('/referral/status')
        .query(validAddresss)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('Object');
          //console.log(res.text);
          done();
        });
    });
  });
});

//// addReferral endpoint

let clientAddressAlreadyExists = {
  'clientAddress': '0xFDeda15e2922C5ed41fc1fdF36DA2FB2623666b3',
  'referralAddress': '0xa3f1592d8a09a91a7238f608620ffde7c4b26029'
}
let validAddress = {
  'clientAddress': '0xFDeda15e2922C5ed41fc1fdF36DA2FB2623666b3',
  'referralAddress': '0xa3f1592d8a09a91a7238f608620ffde7c4b26029'
}
let referralAddressNotExists = {
  'clientAddress': '0xc7437a5BE166d1F08478Cf81D22CbBb4EdFFfbFd',
  'referralAddress': '0x73295d3c0cA46113Ca226222C81C79ADabF9f391'
}
let sameAddress = {
  'clientAddress': '0x6b6dF9E25F7Bf2e363ec1A52a7Da4c4A64f5769E',
  'referralAddress': '0x6b6dF9E25F7Bf2e363ec1A52a7Da4c4A64f5769E'
}

describe('Route addReferral', () => {
  describe('/POST ', () => {

    it('With same client and referral address will return error ', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .post('/referral')
        .send(sameAddress)
        .end((err, res) => {
          res.should.have.status(400);
          //console.log(res.text);
          done();
        });
    });

    it('With valid client and referrence address should map referrence address to aclient address  ', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .post('/referral')
        .send(validAddress)
        .end((err, res) => {
          res.should.have.status(200);
          // console.log(res.text);
          done();
        });
    });

    it('With non existing referral address should return error ', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .post('/referral')
        .send(referralAddressNotExists)
        .end((err, res) => {
          res.should.have.status(400);
          // console.log(res.text);
          done();
        });
    });

    it('With existing client address should return error ', (done) => {
      chai.request('https://refer-api.sentinelgroup.io')
        .post('/referral')
        .send(clientAddressAlreadyExists)
        .end((err, res) => {
          res.should.have.status(400);
          // console.log(res.text);
          done();
        });
    });
  });
});
