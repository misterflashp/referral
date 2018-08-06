let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let server = 'https://refer-api.sentinelgroup.io';
let expect = chai.expect;
let should = chai.should();

//Routes
let bonusClaimRoute = '/bonus/claim';
let getBonusInfoRoute = '/bonus/info';
//Test data
let deviceIdNotRegistered = {
    'deviceId':'000'
}
let deviceIdWithoutAddress ={
    'deviceId':'xyz'
}
let noBonusToClaim ={
    'deviceId':'hii'
}
let validDeviceId={
    'deviceId':'xyz1'
}
// bonusClaim endpoint
describe('Route bonusClaim' + bonusClaimRoute, () => {
  it('With device ID which is not registered should return error ', (done) => {
    chai.request(server)
      .post(bonusClaimRoute)
      .send(deviceIdNotRegistered)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With deviceId not having address should return error', (done) => {
    chai.request(server)
      .post(bonusClaimRoute)
      .send(deviceIdWithoutAddress)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With device ID no unclaimed bonuses should return error ', (done) => {
    chai.request(server)
      .post(bonusClaimRoute)
      .send(noBonusToClaim)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With valid device ID with unclaimed bonus should claim bouns successfully', (done) => {
    chai.request(server)
      .post(bonusClaimRoute)
      .send(validDeviceId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
// getBonusInfo endpoint

describe('Route getBonusInfo' + getBonusInfoRoute, () => {
    it('With non registered device ID should return error ', (done) => {
        chai.request(server)
          .get(getBonusInfoRoute)
          .query(deviceIdNotRegistered)
          .end((err, res) => {
            console.log(res.text);
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
      });
    it('With device ID should return bonus information', (done) => {
      chai.request(server)
        .get(getBonusInfoRoute)
        .query(validDeviceId)
        .end((err, res) => {
          console.log(res.text);
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
});