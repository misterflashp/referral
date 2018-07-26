let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
//let server = require('../../server');
//testing referrance address : 0xa3f1592d8a09a91a7238f608620ffde7c4b26029
let expect = chai.expect;
let should = chai.should();

let claimBonusRoute = '/referral/claim';
let clientReferralIdWithoutPayment = {
  'clientReferralId': '6aa68136'
}
let clientReferralIdWithPayment = {
  'clientReferralId': '6aa68131'
}
let invalidClientReferralId = {
  'clientReferralId': '00000000'
  }  
  
 describe('Route claimBonus' + claimBonusRoute, () => {
  it('With valid clientReferralId without payment should return error ', (done) => {
    chai.request('http://localhost:3000')
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
    chai.request('http://localhost:3000')
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
    chai.request('http://localhost:3000')
      .post(claimBonusRoute)
      .send(invalidClientReferralId)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

////  getReferralInfo endpoint

// let getReferralInfoRoute = '/referral/info';
// let clientReferralId = {
//   'clientReferralId': '6aa68136'
// }
// let invalidClientReferralId = {
//   'clientReferralId': '00000000'
//   }  
//  describe('Route getReferralInfo' + getReferralInfoRoute, () => {
//   it('With valid details should return referral stats ', (done) => {
//     chai.request('http://localhost:3000')
//       .get(getReferralInfoRoute)
//       .query(clientReferralId)
//       .end((err, res) => {
//         console.log(res.text);
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         done();
//       });
//   });
//   it('With invalid referral id should return error ', (done) => {
//     chai.request('http://localhost:3000')
//       .get(getReferralInfoRoute)
//       .query(invalidClientReferralId)
//       .end((err, res) => {
//         console.log(res.text);
//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         done();
//       });
//   });
//  });

//// addReferral endpoint


// let validDetails = {
//   'clientAddress': '0xFDeda15e2122C5ed11fc1fdF36DA2FB2623666b3',
//   'referralId': '6aa68136'
// }
// let clientAddressAlreadyExists = {
//   'clientAddress': '0xFDeda15e2922Ceed41fc1wfdF33DA2F22623666b3',
//   'referralId': '6aa68136'
// }
// let referralIdNotExists = {
//   'clientAddress': '0xFDeda15e1922Ceed43fc1wfdF33DA2F22623666b3',
//   'referralId': '00000000'
// }
// addReferralRoute = '/referral';
// describe('Route addReferral' + addReferralRoute, () => {
//   it('With valid details should map referral id with given client address ', (done) => {
//     chai.request('http://localhost:3000')
//       .post(addReferralRoute)
//       .send(validDetails)
//       .end((err, res) => {
//         console.log(res.text);
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         done();
//       });
//   });
//   it('With existing client address should return error ', (done) => {
//     chai.request('http://localhost:3000')
//       .post(addReferralRoute)
//       .send(clientAddressAlreadyExists)
//       .end((err, res) => {
//         console.log(res.text);
//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         done();
//       });
//   });
//   it('With non existing referral id should return error ', (done) => {
//     chai.request('http://localhost:3000')
//       .post(addReferralRoute)
//       .send(referralIdNotExists)
//       .end((err, res) => {
//         console.log(res.text);
//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         done();
//       });
//   });
// });


// describe('Route addReferral', () => {
//     it('With same client and referral address will return error ', (done) => {
//       chai.request('http://localhost:3000')
//         .post('/referral')
//         .send(validAddress)
//         .end((err, res) => {
//           res.should.have.status(400);
//           console.log(res.text);
//           done();
//         });
//     });
//   });

//     it('With valid client and referrence address should map referrence address to aclient address  ', (done) => {
//       chai.request('https://refer-api.sentinelgroup.io')
//         .post('/referral')
//         .send(validAddress)
//         .end((err, res) => {
//           res.should.have.status(200);
//           // console.log(res.text);
//           done();
//         });
//     });

//     it('With non existing referral address should return error ', (done) => {
//       chai.request('https://refer-api.sentinelgroup.io')
//         .post('/referral')
//         .send(referralAddressNotExists)
//         .end((err, res) => {
//           res.should.have.status(400);
//           // console.log(res.text);
//           done();
//         });
//     });

//     it('With existing client address should return error ', (done) => {
//       chai.request('https://refer-api.sentinelgroup.io')
//         .post('/referral')
//         .send(clientAddressAlreadyExists)
//         .end((err, res) => {
//           res.should.have.status(400);
//           // console.log(res.text);
//           done();
//         });
//     });
//   });
// });
