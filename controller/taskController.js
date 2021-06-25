const Joi = require("joi");
const {saveTask,getAllTasks,updateTask,deleteTask} = require("../services/taskService")

module.exports ={
    createTask:async(req,res)=>{
        const schema = Joi.object({
            title:Joi.string().required().max(20).min(2),
            description:Joi.string().required(),
            archived:Joi.boolean().default(false)
        });
        const validation = schema.validate(req.body);
        if(validation.error){
            res.status(401).send({message:validation.error.message});
            return;
        }
        const data = validation.value;
        data.user = req.user._id;
        try{
            const result = await saveTask(data);
            res.status(201).send({message:"Task added successfully",id:result._id});
        }catch(error){
            res.status(error.code||404).send({message:error.message});
        }

    },
    getAllTasks:async(req,res)=>{
        try{
            const query = req.query.title;
            const tasks = await getAllTasks(query);
            const updatedTasks = tasks.map((task)=>{
                task.user.password = undefined;
                return task;
            });
            res.status(201).send(updatedTasks);
        }catch(error){
            res.status(error.code).send(error.message);
        }
    },
    editTask:async(req,res)=>{
        const schema = Joi.object({
            id:Joi.string().required(),
        });
        const validation = schema.validate(req.params);
        if(validation.error){
            res.status(401).send({message:validation.error.message});
            return;
        }
        const {id} = validation.value;
        const body = req.body;


            try{
                const result = await updateTask(id,body);
                if (result){res.status(201).send({message:"Successfully updated"});}
                else{
                    res.status(401).send({message:"Task not exist"})
                }


            }catch(error){
                res.status(error.status||404).send({message:error.message});
            }


    },
    deleteTask:async(req,res)=>{
        const schema = Joi.object({
            id:Joi.string().required(),
        });
        const validation = schema.validate(req.params);
        if(validation.error){
            res.status(401).send({message:validation.error.message});
            return;
        }
        const {id} = validation.value;

        try{
            const result= await deleteTask(id);
            if (result){ res.status(201).send({message:"Successfully deleted"});}
            else{
                res.status(401).send({message:"Task not exist"})
            }
        }catch(error){
            res.status(error.status||404).send({message:error.message});
        }

    }
}