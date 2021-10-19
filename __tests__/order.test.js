const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { Category } = require('../src/models/Category');
const { Product } = require('../src/models/Product');
const { User } = require('../src/models/User');
const mockData = require('./mock.json')

chai.use(chaiHttp);
chai.should();
describe("/order",()=>{
    describe("POST /order",()=>{
        it("creates an order if cart exists for logged in user",async ()=>{
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']
            const products = await Product.find({}) 
            const resBody = {
                productIds:[
                    {
                        product:products[0].id,
                        quantity:20
                    }
                ]
            }
            await chai
                .request(app)
                .post('/cart')
                .set('Content-Type','application/json')
                .set('auth-token',auth_token)
                .send(resBody)

            const res = await chai
                            .request(app)
                            .post('/order')
                            .set('Content-Type','application/json')
                            .set('auth-token',auth_token)
            expect((/Order successful/i).test(res.body.message)).to.eql(true)
            expect(res.body.totalPrice).to.eql(1010)

        })

        it("does not create order if cart does not exist i.e empty",async ()=>{
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']

            const res = await chai
                            .request(app)
                            .post('/order')
                            .set('Content-Type','application/json')
                            .set('auth-token',auth_token)
            expect((/No cart found/i).test(res.body.message)).to.eql(true)
            expect(res.status).to.eql(400)
        })

        it("returns message out of stock if cart product quantity more than in stock",async ()=>{
            const product = await Product.findOne({})
            const cartBod = {
                productIds:[
                    {
                        product:product.id,
                        quantity:product.quantity + 10
                    }
                ]
            }
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']
            await chai
                .request(app)
                .post('/cart')
                .set('Content-Type','application/json')
                .set('auth-token',auth_token)
                .send(cartBod)
            const res = await chai
                            .request(app)
                            .post('/order')
                            .set('Content-Type','application/json')
                            .set('auth-token',auth_token) 
            expect((/Some products are out of stock/i).test(res.body.message)).to.eql(true)
            expect(res.body.outOfStockItems).to.eql(product.name)
        })
    })
})