const User = require('../schemas/user.schema');

module.exports={
    saveUser:async(data)=>{
            const user = new User(data);
            const isExist = await User.findOne({email:data.email});
            if (isExist){
                throw new Error("Email already exist");
                return;
            }
            const result = await user.save();
            return result;
    },
    getUserByEmail:async(email)=>{
        const user =await User.findOne({email});
        return user;
    },
}