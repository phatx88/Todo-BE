const Task = require('../../schemas/task.schema');
const User = require('../../schemas/user.schema');
const mongoose = require("mongoose");

const chai = require ('chai')
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const server = require('../../index.js')

describe("Task Route Tests",()=>{
    let token;
    let currentUser;
    let result;
    before(  done=>{
        mongoose.connect(
            process.env.DB_CONNECT,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    console.log(err);
                    done(err)
                } else {
                    console.log("Succesfully connected to database");

                }
            }
        );
            const testUser = {name:"TestUser",email:"testuser@gmail.com",password:"123456"};
             chai.request(server)
                .post('/api/user/register')
                .send(testUser)
                .end((err,res)=>{
                    result = res.body;
                    const user={email:"testuser@gmail.com",password:"123456"}
                    chai.request(server)
                        .post('/api/user/login')
                        .send(user)
                        .end((err,res)=>{
                            res.should.have.status(200);
                            token=res.body.token
                            currentUser = res.body.user;
                            done();
                        })
                })




    })
    describe("POST /api/task/addTask",()=>{
        let id;

        it("It should give a description validation error",(done)=>{
            const task={title:"Test Task",
            }
            chai.request(server)
                .post('/api/task/addTask')
                .set({ "Authorization": `Bearer ${token}` })
                .send(task)
                .end((err,res)=>{
                    res.should.have.status(401);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("\"description\" is required");
                    done()
                })
        })

        it("It should add new task to the logged user",(done)=>{
            const task={title:"Test Task",
                description:"This is the test task description"
            }
            chai.request(server)
                .post('/api/task/addTask')
                .set({ "Authorization": `Bearer ${token}` })
                .send(task)
                .end((err,res)=>{
                    res.should.have.status(201);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq('Task added successfully');
                    res.body.should.have.property('id');
                    id = res.body.id;
                    done()
                })
        })
        after(async()=>{
            await Task.findByIdAndDelete(id);
        })
    })

    describe("GET /api/task/getAllTasks",()=>{

        it("It should return all the tasks",(done)=>{
            chai.request(server)
                .get('/api/task/getAllTasks')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err,res)=>{
                    res.should.have.status(201);
                    res.body.should.have.a('array');
                   // res.body.should.have.contains('object');
                    done()
                })
        })
    })


    describe("PATCH /api/task/editTask",()=>{
        let id;
        before((done)=>{
            const task={title:"Test Task",
                description:"This is the test task description"
            }
            chai.request(server)
                .post('/api/task/addTask')
                .set({ "Authorization": `Bearer ${token}` })
                .send(task).end((err,res)=>{
                id = res.body.id;
                done()
            })
        })

        it("It should give a id validation error",(done)=>{
            const editedTask = {description:"edited test task",title:"Test Title"}
            chai.request(server)
                .patch(`/api/task/editTask/test`)
                .set({ "Authorization": `Bearer ${token}` })
                .send(editedTask)
                .end((err,res)=>{
                    res.should.have.status(404);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("Cast to ObjectId failed for value \"test\" (type string) at path \"_id\" for model \"Task\"");
                    done()
                })
        })

        it("It should give a task not exist error",(done)=>{
            const editedTask = {description:"edited test task",title:"Test Title"}
            chai.request(server)
                .patch(`/api/task/editTask/60d46e0c9c7f832015406730`)
                .set({ "Authorization": `Bearer ${token}` })
                .send(editedTask)
                .end((err,res)=>{
                    res.should.have.status(401);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("Task not exist");
                    done()
                })
        })

        it("It should edit the task",(done)=>{
            const editedTask = {description:"edited test task",title:"Test Title"}
            chai.request(server)
                .patch(`/api/task/editTask/${id}`)
                .set({ "Authorization": `Bearer ${token}` })
                .send(editedTask)
                .end((err,res)=>{
                    res.should.have.status(201);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq('Successfully updated');
                    done()
                })
        })
        after(async()=>{
            await Task.findByIdAndDelete(id);
        })
    })
    describe("DELETE /api/task/deleteTask",()=>{
        let id;
        before((done)=>{
            const task={title:"Test Task",
                description:"This is the test task description"
            }
            chai.request(server)
                .post('/api/task/addTask')
                .set({ "Authorization": `Bearer ${token}` })
                .send(task).end((err,res)=>{
                id = res.body.id;
                done()
            })
        })

        it("It should give a id validation error",(done)=>{
            chai.request(server)
                .delete(`/api/task/deleteTask/test`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err,res)=>{
                    res.should.have.status(404);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("Cast to ObjectId failed for value \"test\" (type string) at path \"_id\" for model \"Task\"");
                    done()
                })
        })

        it("It should give a task not exist error",(done)=>{
            chai.request(server)
                .delete(`/api/task/deleteTask/60d46e0c9c7f832015406730`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err,res)=>{
                    res.should.have.status(401);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq("Task not exist");
                    done()
                })
        })

        it("It should delete the relevant task",(done)=>{
            chai.request(server)
                .delete(`/api/task/deleteTask/${id}`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err,res)=>{
                    res.should.have.status(201);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eq('Successfully deleted');
                    done()
                })
        })
    })

    after(async()=>{
        await User.findOneAndDelete({email:"testuser@gmail.com"});
    })
})