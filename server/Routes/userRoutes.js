const{register}=require("../controller/usersController");
const{login}=require("../controller/usersController");
const { setAvatar } = require("../controller/usersController");
const { getAllUsers } = require("../controller/usersController");
const{logOut}=require("../controller/usersController")
const router=require ("express").Router();
router.post("/register",register);
router.post("/login",login);
router.put("/setAvatar/:id",setAvatar);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout/:id", logOut);
module.exports=router;