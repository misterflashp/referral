let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let server = 'https://refer-api.sentinelgroup.io';
//testing referrance address : 0xa3f1592d8a09a91a7238f608620ffde7c4b26029
let expect = chai.expect;
let should = chai.should();

//Routes
let claimBonusRoute = '/referral/claim';
let addReferralRoute = '/referral';
let getReferralInfoRoute = '/referral/info';

//correctDetails
let clientReferralIdWithoutPayment = {
  'clientReferralId': '7bdb3a1b'
}
let bonusAlreadyClaimed = {
  'clientReferralId': '6aa68131'
}
let clientReferralIdWithPayment = {
  'clientReferralId': '6aa68134'
}
let clientReferralId = {
  'clientReferralId': '7bdb3a1b'
}
let invalidClientReferralId = {
  'clientReferralId': '00000000'
}
let validDetails = {
  'clientAddress': '0xFDeda15e1922Ceed43fc1wfdF33DA2F22623666b3',
  'referralId': '7bdb3a1b'
}
let clientAddressAlreadyExists = {
  'clientAddress': '0x6Cf63F4626210576A2bD674b0Bb8469Bba9a4629',
  'referralId': '7bdb3a1b'
}
let referralIdNotExists = {
  'clientAddress': '0xFDeda15e1922Ceed43fc1wfdF33DA2F22623666b3',
  'referralId': '00000000'
}

//claimBonusRoute endpoint
describe('Route claimBonus' + claimBonusRoute, () => {
  it('With valid clientReferralId without payment should return error ', (done) => {
    chai.request(server)
      .post(claimBonusRoute)
      .send(clientReferralIdWithoutPayment)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With valid clientReferralId with payment should transfer bonus ', (done) => {
    chai.request(server)
      .post(claimBonusRoute)
      .send(clientReferralIdWithPayment)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With invalid clientReferralId should return error ', (done) => {
    chai.request(server)
      .post(claimBonusRoute)
      .send(invalidClientReferralId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With already claimed referral id should return error', (done) => {
    chai.request(server)
      .post(claimBonusRoute)
      .send(bonusAlreadyClaimed)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

// addReferral endpoint
describe('Route addReferral' + addReferralRoute, () => {
  it('With valid details should map referral id with given client address ', (done) => {
    chai.request(server)
      .post(addReferralRoute)
      .send(validDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With existing client address should return error ', (done) => {
    chai.request(server)
      .post(addReferralRoute)
      .send(clientAddressAlreadyExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With non existing referral id should return error ', (done) => {
    chai.request(server)
      .post(addReferralRoute)
      .send(referralIdNotExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

//  getReferralInfo endpoint
describe('Route getReferralInfo' + getReferralInfoRoute, () => {
  it('With valid details should return referral stats ', (done) => {
    chai.request(server)
      .get(getReferralInfoRoute)
      .query(clientReferralId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With invalid referral id should return error ', (done) => {
    chai.request(server)
      .get(getReferralInfoRoute)
      .query(invalidClientReferralId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});