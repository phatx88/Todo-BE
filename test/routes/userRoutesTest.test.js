const User = require('../../schemas/user.schema');
const mongoose = require("mongoose");

const chai = require ('chai')
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const server = require('../../index.js')

 describe("User Tests",()=>{
     let result;
     before( done=>{
        mongoose.connect(
            process.env.DB_CONNECT,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    done(err)
                } else {
                    console.log("Succesfully connected to database");
                    const testUser ={name:"TestUser",email:"testuser@gmail.com",password:"123456"};
                    chai.request(server)
                        .post('/api/user/register')
                        .send(testUser)
                        .end((err,res)=>{
                            result = res.body;
                            done()
                        })
                }
            }
        );

     })
     describe("POST /api/user/login",()=>{
         it("It should login user",(done)=>{
             const user={email:"testuser@gmail.com",password:"123456"}
             chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('sucess').eq(1);
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');
                    done()
                })
         })
         it("It should give invalid email error",(done)=>{
            const user={email:"invalidemail@gmail.com", password:"123456"}
            chai.request(server)
               .post('/api/user/login')
               .send(user)
               .end((err,res)=>{
                res.should.have.status(404);
                res.body.should.have.a('object');
                res.body.should.have.property('message').eq("Invalid Email");
                done()
               })
        })
        it("It should give invalid password error",(done)=>{
            const user={email:"testuser@gmail.com",password:"invalid Password"}
            chai.request(server)
               .post('/api/user/login')
               .send(user)
               .end((err,res)=>{
                res.should.have.status(403);
                res.body.should.have.a('object');
                res.body.should.have.property('message').eq("Password is invalid");
                done()
               })
        })
        it("It should give email is required",(done)=>{
            const user={password:"invalid Password"}
            chai.request(server)
               .post('/api/user/login')
               .send(user)
               .end((err,res)=>{
                res.should.have.status(401);
                res.body.should.have.a('object');
                res.body.should.have.property('message').eq("\"email\" is required");
                done()
               })
        })
     })

     describe("POST /api/user/register",()=>{
        it("It should register user",(done)=>{
            const user={email:"regTest123@gmail.com",password:"123456",name:"Mahela"}
            chai.request(server)
               .post('/api/user/register')
               .send(user)
               .end((err,res)=>{
                   res.should.have.status(201);
                   res.body.should.have.a('object');
                   res.body.should.have.property('result');
                   done()
               })
        })
        it("Email validation error should occur",(done)=>{
            const user={email:"invalidEmailFormat",password:"123456",name:"Mahela"}
            chai.request(server)
               .post('/api/user/register')
               .send(user)
               .end((err,res)=>{
                    res.should.have.status(401);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("\"email\" must be a valid email");
                    done()
               })
        })
        after(async()=>{
           const res = await User.findOneAndDelete({email:'regTest123@gmail.com'});
       })
    })

    describe("GET /api/user/me",()=>{
        let token;
        before(done=>{
            const user={email:"phatx40@gmail.com",password:"password"}
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200);
                    token=res.body.token
                    done()
                })
        })
        it("It should give current user",(done)=>{
            chai.request(server)
               .get('/api/user/me')
               .set({ "Authorization": `Bearer ${token}` })
               .end((err,res)=>{
                   res.should.have.status(201);
                   done()
               })
        })
    })
     after(async()=>{
         await User.findOneAndDelete({email:"testuser@gmail.com"});
     })
 })