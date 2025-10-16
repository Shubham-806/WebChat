// const express= require("express");
// const cors= require("cors");
// const mongoose = require("mongoose");
// const userRoutes=require("./Routes/userRoutes");
// const app=express();
// require ("dotenv").config();
// app.use("/api/auth", userRoutes);

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth",userRoutes)
// mongoose.connect(process.env.MONGO_URL,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,

// }).then(()=>{
//     console.log("DBconnect Successfully");

// })
// .catch((err)=>{
//     console.log(err.message);
// });
// const server =app.listen(process.env.PORT,()=>{
//     console.log(`server start on PORT ${process.env.PORT}`);
// });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const socket = require("socket.io");
const userRoutes = require("./Routes/userRoutes");

const app = express();

// ✅ Correct CORS Configuration (Allow frontend)
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend requests
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Body Parser Middleware (Fix 500 Error)
app.use(express.json());

// ✅ Register Routes Once
app.use("/api/auth", userRoutes);
app.get("/api/avatar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://api.multiavatar.com/${id}`);
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("DB connected successfully");
}).catch((err) => {
  console.log("DB Connection Error:", err.message);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});