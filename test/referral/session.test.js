let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let server = 'https://refer-api.sentinelgroup.io';
let expect = chai.expect;
let should = chai.should();

//Routes
let addSessionRoute = '/session';
//Test data
let deviceIdNotRegistered = {
  'deviceId': '0000',
  'session': {
    'sessionId': 'session1',
    'paymentTxHash': 'session1hash'
  }
}
let addSncSession = {
  'deviceId': 'xyz1',
  'session': {
    'sessionId': 'session2',
    'paymentTxHash': '0x95c1855517d0f2b1f45c4065a973fdc897da3d742f657ead5b9941ee769280d5'
  }
}
let addSlcSession = {
  'deviceId': 'xyz1',
  'session': {
    'sessionId': 'session1',
  }
}
let addFirstSncSession = {
  'deviceId': 'xyz1',
  'session': {
    'sessionId': 'session1',
    'paymentTxHash': '0x157da6df79b43f186ff4c6c6c61ca52dcbfbc67eecf29534d2f1fc389ad39bed'
  }
}
// addSession endpoint
describe('Route addSession' + addSessionRoute, () => {
  it('With device ID which is not registered should return error ', (done) => {
    chai.request(server)
      .post(addSessionRoute)
      .send(deviceIdNotRegistered)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With correct SNC session details and device ID first time should add session and bonus ', (done) => {
    chai.request(server)
      .post(addSessionRoute)
      .send(addFirstSncSession)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With correct SNC session details and device ID should add session ', (done) => {
    chai.request(server)
      .post(addSessionRoute)
      .send(addSncSession)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With correct SLC session details and device ID should add session ', (done) => {
    chai.request(server)
      .post(addSessionRoute)
      .send(addSlcSession)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
