const mockData = require('./mock.json')
const { Category } = require('../src/models/Category');
const { mock } = require('sinon');
const { Product } = require('../src/models/Product');
const { User } = require('../src/models/User');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');
chai.use(chaiHttp);
chai.should();
let category;
let products =[];
before(async ()=>{
    const normalUser = await chai.request(app).post('/auth/signup').set('Content-Type','application/json').send(mockData.users.normalUser)
    const admin = await chai.request(app).post('/auth/signup').set('Content-Type','application/json').send(mockData.users.admin)
    await User.findOne({email:mockData.users.admin.email}).update({role:"admin"})
    const  category = await Category(mockData.categories[0]).save()
    mockData.products.forEach(async p=>{
        const pp = await Product({...p,category:category.id}).save()
        products.push(pp)
    })
})