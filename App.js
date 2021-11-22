const express = require("express");
const app = express(); //export express in app variable
const cors = require("cors"); //make request to a domain which is outside the server, to make cross domain request possible
const mongoose = require("mongoose"); //mongoDB object modelling tool which work in asynchronous environment
const userRoute=require('./Routes/UserRoutes')//import routes
app.use(cors());

//for post requests(convert input into json object)
app.use(express.json());
//to recognized the converted json object into array or string
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/api",userRoute)

//to connect to mongoDB

const DB_CONNECT = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ecommerce:123456abcd@cluster0.wav1d.mongodb.net/ecommerce?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("DB COnnected!");
  } catch (error) {
    console.log(error);
  }
};

DB_CONNECT();

app.get("/api",(req,res)=>{
    console.log("go to localhost");
    res.send("HI")
})


app.listen(9000, () => {
  console.log("backend server running on 9000!!");
}); //Connect your server to a port number, the port number here is 9000 which is a parameter
