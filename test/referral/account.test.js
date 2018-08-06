let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
//let server = require('../../server');
let expect = chai.expect;
let should = chai.should();
let server= "https://refer-api.sentinelgroup.io"
//Routes
let addAccountRoute = '/account';
let getAccountRoute = '/account';
let updateAccountRoute = '/account';
//add account
let onlyDeviceId = {
  'deviceId': 'pqr'
}
let validDetails = {
  'address': '0x9e32278AAC4Fa841B174A986c4Ec33a3bE55600c',
  'referredBy': 'ram',
  'deviceId': 'xyz1'
}
let validDetailsWithoutAddress = {
  'referredBy': 'ram',
  'deviceId': 'xyz2'
}

let deviceIdAlreadyExists = {
  'deviceId':'xyz'
}
let referredByNotExists = {
  'deviceId':'ram1',
  'referredBy':'ram1'
}
//get account
let validDeviceId = {
  'deviceId': 'xyz'
}
let deviceNotRegistered = {
  'deviceId': '000'
}
//updateAccount
let deviceNotRegisteredUpdate = {
  'deviceId': '00000000',
  'address': '0xfCDc1446ED6256788C4b0d63df5491CE250A8FE5'
}
let accountAlreadyExists = {
  'deviceId': 'ram',
  'address': '0xfCDc1446ED6256788C4b0d63df5491CE250A8FE5'
}
let addressAlreadyLinkedToOtherDevice = {
  'deviceId': 'xyz2',
  'address': '0x9e32278AAC4Fa841B174A986c4Ec33a3bE55600c'
}
let validDetailsUpdate = {
  'deviceId': 'xyz2',
  'address': '0x18aFdC4d9B47899F524d9ec9EFdA48251cEBabAD'
}


// getAccount endpoint
describe('Route getAccount' + getAccountRoute, () => {
  it('With valid device ID should return account details ', (done) => {
    chai.request(server)
      .get(getAccountRoute)
      .query(validDeviceId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With not registered device ID should return error ', (done) => {
    chai.request(server)
      .get(getAccountRoute)
      .query(deviceNotRegistered)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

// addAccount endpoint
describe('Route addAccount' + addAccountRoute, () => {
  it('With only device ID should create account', (done) => {
    chai.request(server)
      .post(addAccountRoute)
      .send(onlyDeviceId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With valid details should map referredBy  with given device ID ', (done) => {
    chai.request(server)
      .post(addAccountRoute)
      .send(validDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With valid details without address should map referredBy  with given device ID ', (done) => {
    chai.request(server)
      .post(addAccountRoute)
      .send(validDetailsWithoutAddress)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With existing device ID should return error ', (done) => {
    chai.request(server)
      .post(addAccountRoute)
      .send(deviceIdAlreadyExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With non existing referredBy should return error ', (done) => {
    chai.request(server)
      .post(addAccountRoute)
      .send(referredByNotExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
})

//updateAccount endpoint
describe('Route updateAccount' + updateAccountRoute, () => {
  it('With not registered device ID should return error ', (done) => {
    chai.request(server)
      .put(updateAccountRoute)
      .send(deviceNotRegisteredUpdate)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With device ID which already linked with an address should return error ', (done) => {
    chai.request(server)
      .put(updateAccountRoute)
      .send(accountAlreadyExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With the address already linked to other device should return error ', (done) => {
    chai.request(server)
      .put(updateAccountRoute)
      .send(addressAlreadyLinkedToOtherDevice)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With valid address should link to given ID ', (done) => {
    chai.request(server)
      .put(updateAccountRoute)
      .send(validDetailsUpdate)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});


