const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { Category } = require('../src/models/Category');
const { User } = require('../src/models/User');
const mockData = require('./mock.json')

chai.use(chaiHttp);
chai.should();

describe("/category", () => {
    describe("GET /category", () => {
        it('should return the list of all products', async () => {
            const res = await chai
                .request(app)
                .get('/category')
                .set('Content-Type', 'application/json')

            expect(res.body.categories.length).to.eql(1)
        })
    })
    describe("POST /category", () => {
        describe("When normal user sends request", () => {
            it("Should not add the category and return a message", async () => {
                const { email, password } = mockData.users.normalUser
                // sign in 
                const signInRes = await chai.request(app).post('/auth/signin')
                    .set('Content-Type', 'application/json')
                    .send({ email, password })
                
                const auth_token = signInRes.body['auth-token']
                const reqBody = {
                    name:'Cars'
                }
                const prodRes = await chai.request(app).post('/category')
                    .set('Content-Type', 'application/json')
                    .set('auth-token',auth_token)
                    .send(reqBody)
                expect(prodRes.status).to.eql(400)
                expect((/Access denied/i).test(prodRes.body.message)).to.eql(true)
            })
        })
        describe("When admin sends request", () => {
            it("Should add the category", async () => {
                const { email, password } = mockData.users.admin
                const category = await Category.findOne({})
                // sign in 
                const signInRes = await chai.request(app).post('/auth/signin')
                    .set('Content-Type', 'application/json')
                    .send({ email, password })
                const auth_token = signInRes.body['auth-token']
                const reqBody = {
                    name: 'Cars 2',
                }
                const prodRes = await chai.request(app).post('/category')
                    .set('Content-Type', 'application/json')
                    .set('auth-token',auth_token)
                    .send(reqBody)
                expect(prodRes.body.result).to.not.eql(undefined)
                expect(prodRes.body.result.name).to.eql(reqBody.name)
            })
        })
    })
})