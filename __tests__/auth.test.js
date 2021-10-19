const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Signup", () => {
    describe("POST /auth/signup", () => {
        // validation error cases start
        it("returns validation error when invalid email is sent", (done) => {
            const signUpBody = {
                "email": "akak.com",
                "password": "311114",
                "fullName": "dkj asdaskjdnaskjn"
            }
            chai
                .request(app)
                .post('/auth/signup')
                .set('Content-Type', 'application/json')
                .send(signUpBody)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).not.to.eql(null)
                    expect(res.body.error).not.to.eql(null)
                    expect(res.body.error[0].message.includes('email')).to.eql(true)
                    expect(res.status).to.eql(400)
                    done()
                })
        })
        it("returns validation error when passowrd is less than 6 characters", (done) => {
            const signUpBody = {
                "email": "ak@aak.com",
                "password": "31",
                "fullName": "dkj asdaskjdnaskjn"
            }
            chai
                .request(app)
                .post('/auth/signup')
                .set('Content-Type', 'application/json')
                .send(signUpBody)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).not.to.eql(null)
                    expect(res.body.error).not.to.eql(undefined)
                    expect(res.body.error[0].message.includes('password')).to.eql(true)
                    expect(res.status).to.eql(400)
                    done()
                })
        })
        it("returns validation error when fullName is not present or is less than 6 chars", (done) => {
            const signUpBody = {
                "email": "ak@aak.com",
                "password": "123456",
                "fullName": "dkj"
            }
            chai
                .request(app)
                .post('/auth/signup')
                .set('Content-Type', 'application/json')
                .send(signUpBody)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).not.to.eql(null)
                    expect(res.body.error).not.to.eql(undefined)
                    expect(res.body.error[0].message.includes('fullName')).to.eql(true)
                    expect(res.status).to.eql(400)
                    done()
                })
        })
        // validation error cases end

        //Successful signup case
        it("returns user key with value as userId on succesful signup", (done) => {
            const signUpBody = {
                "email": "ak@aakq.com",
                "password": "123456",
                "fullName": "dkjklq"
            }
            chai
                .request(app)
                .post('/auth/signup')
                .set('Content-Type', 'application/json')
                .send(signUpBody)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).not.to.eql(null)
                    expect(res.body.error).to.eql(undefined)
                    expect(res.body.user).to.not.
                        eql(null)
                    expect(res.status).to.eql(200)
                    done()
                })
        })
        // email already exists
        it("returns error if email already exists", async () => {

            const signUpBody = {
                "email": "ak@aakq.com",
                "password": "123456",
                "fullName": "dkjdddd"
            }
            const res = await chai
                .request(app)
                .post('/auth/signup')
                .set('Content-Type', 'application/json')
                .send(signUpBody);
            expect(res.body).not.to.eql(null)
            expect(res.body.error).not.to.eql(undefined)

            expect((/Email already in use by someone/i).test(res.body['error'])).to.eql(true)
            expect(res.status).to.eql(400)
        })
    })
})
describe("Signin",()=>{
    describe("POST /auth/signin", () => {
        it("returns auth-token and message in response and auth-token in header on successful login", async () => {
            const signInBody = {
                "email": "ak@aakq.com",
                "password": "123456"
            }
            const res = await chai
                .request(app)
                .post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send(signInBody);

            expect(res.body).not.to.eql(null)
            expect(res.body.error).to.eql(undefined)
            expect(res.body['auth-token']).to.not.eql(undefined)
            expect(res.header['auth-token']).to.not.eql(undefined)
            expect((/User logged in successfully/i).test(res.body.message)).to.eql(true)
            expect(res.status).to.eql(201)
        })

        it("returns message password is wrong on wrong password", async () => {
            const signInBody = {
                "email": "ak@aakq.com",
                "password": "123456a"
            }
            const res = await chai
                .request(app)
                .post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send(signInBody);

            expect(res.body).not.to.eql(null)
            expect(res.body.message).to.not.eql(undefined)
            expect(res.body['auth-token']).to.eql(undefined)
            expect(res.header['auth-token']).to.eql(undefined)
            expect((/password is wrong/i).test(res.body.message)).to.eql(true)
            expect(res.status).to.eql(400)
        })

    })
})