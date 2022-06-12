import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3034;
const app = express();   
const connectionOptions = { useUnifiedTopology: true, useNewUrlParser: true};


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

mongoose.connect(process.env.DATABASE, connectionOptions)
    .then(() => console.log("Connected successfully"))
    .catch((err) => console.error(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

//Routes

app.use('/posts', postRoutes);

app.get("/",(req, res)=>{
    res.json("server start")
})

app.post("/login", (req, res)=> {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if(user) {
            if(password === user.password) {
                res.send({ message: "Login Successfull", user: user })
            } else {
                res.send({ message: "Password didn't match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
});

app.post("/register", (req, res)=> {
    const { name, email, password } = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save( err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
            
        }
    }) 
});

app.listen(PORT, () => {
    console.log("The server is listening on port " + PORT);
});