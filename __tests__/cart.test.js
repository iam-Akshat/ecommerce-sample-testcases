const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { Cart } = require('../src/models/Cart');
const { Category } = require('../src/models/Category');
const { Product } = require('../src/models/Product');
const { User } = require('../src/models/User');
const mockData = require('./mock.json')

chai.use(chaiHttp);
chai.should();


describe("/cart",()=>{
    describe("POST /cart",()=>{
        it("returns a new cart with the items if no existing cart",async()=>{
            const products = await Product.find({}) 
            const resBody = {
                productIds:[
                    {
                        product:products[0].id,
                        quantity:10
                    }
                ]
            }
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']
            const res = await chai
                .request(app)
                .post('/cart')
                .set('Content-Type','application/json')
                .set('auth-token',auth_token)
                .send(resBody)
            expect(res.body.newCart).to.not.eql(undefined)
            expect(res.body.newCart.products.length).to.eql(1)
        })
        it("updates and returns a new cart if already existing cart",async()=>{
            const products = await Product.find({}) 
            const resBody = {
                productIds:[
                    {
                        product:products[0].id,
                        quantity:10
                    }
                ]
            }
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']
            const res = await chai
                .request(app)
                .post('/cart')
                .set('Content-Type','application/json')
                .set('auth-token',auth_token)
                .send(resBody)
            expect(res.body.newCart).to.not.eql(undefined)
            expect(res.body.newCart.products.length).to.eql(1)
            expect(res.body.newCart.products[0].quantity).to.eql(20)
        })
    })
    describe("GET /cart",()=>{
        it("returns cart if it exists",async ()=>{
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']

            const res = await chai
                            .request(app)
                            .get('/cart')
                            .set('Content-Type','application/json')
                            .set('auth-token',auth_token)
            expect(res.body.cart).to.not.eql(undefined)
            expect(res.body.cart.products.length).to.eql(1)
            expect(res.body.cart.products[0].quantity).to.eql(20)
        })
        it("returns empty array if no cart is found",async()=>{
            const { email, password } = mockData.users.normalUser
            // sign in 
            const signInRes = await chai.request(app).post('/auth/signin')
                .set('Content-Type', 'application/json')
                .send({ email, password })
            
            const auth_token = signInRes.body['auth-token']
            await Cart.deleteMany({})
            const res = await chai
                            .request(app)
                            .get('/cart')
                            .set('Content-Type','application/json')
                            .set('auth-token',auth_token)
            expect(res.body.cart.length).to.eql(0)
        })
    })
})