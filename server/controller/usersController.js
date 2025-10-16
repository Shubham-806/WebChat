const User=require("../model/userModel");
const brcypt=require("bcrypt");
module.exports.register=async(req,res,next)=>{
    try{
        const{username,email,password}=req.body;
        const usernameCheck=await User.findOne({username});
        if(usernameCheck)
            return res.json({msg:"Username already used",status:false});
        const emailCheck=await User.findOne({email});
        if(emailCheck)
            return res.json({msg:"Email already used",status:false});
        const hashedPassword=await brcypt.hash(password,10);
        const user=await User.create({
            email,
            username,
            password:hashedPassword,
        });
        delete user.password;
        return res.json({status:true,user});

    }catch (ex){
        next(ex);
    }
};
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;  // ✅ Ensure username is extracted correctly

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ status: false, msg: "Incorrect username or password" });
        }

        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ status: false, msg: "Incorrect username or password" });
        }

        // ✅ Ensure isAvatarImageSet flag is correctly determined
        user.isAvatarImageSet = user.avatarImage ? true : false;

        return res.json({
            status: true,
            user: {
                _id: user._id,
                username: user.username,
                avatarImage: user.avatarImage,
                isAvatarImageSet: user.isAvatarImageSet,  // ✅ Add this
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        if (!userId || !avatarImage) {
            return res.status(400).json({ message: "User ID and avatar image are required." });
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage: avatarImage,
            },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.json({
            status: true,
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });

    } catch (ex) {
        console.error("Error in setAvatar:", ex);
        next(ex);
    }
};


  
module.exports.getAllUsers=async(req,res,next)=>{
    try{
        const users=await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);

    }catch (ex){
        next(ex);
    }
};
module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };