const Task = require("../schemas/task.schema");

module.exports = {
    saveTask:async(data,id)=>{
        const task = new Task (data);
        const result = await task.save();
        return result;
    },
    getAllTasks:async(query)=>{
        let filter = {archived: false};
        if (query) {
            filter = { title: { $regex: query, $options: "i" },archived: false};
        }
       const result = await Task.find(filter).sort("createdAt").populate("user");
        return result;
    },
    updateTask:async(id,data)=>{
       const result = await Task.findByIdAndUpdate(id,data);
       return result;
    },
    deleteTask:async(id)=>{
        const result = await Task.findByIdAndDelete(id);
        return result;
    }
}
