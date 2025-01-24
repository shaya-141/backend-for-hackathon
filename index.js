import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from "dotenv";
import authRoutes from './routers/auth.js'


const app = express()
const PORT = 4000

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(cors('*'))

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log('MONGODB CONNECTED SUCCESSFULLY')
)
.catch((err)=> console.log('ERROR IN CONNECTION',err)
)



app.get('/',(req,res)=>{
    console.log('FETCH  SUCCESSFULLY');
    res.send("FETCH  SUCCESSFULLY AND API CALL SUCCESSFULLY")
    
})
app.get('/about',(req,res)=>{
    console.log('FETCH  SUCCESSFULLY about');
    res.send("FETCH  SUCCESSFULLY AND API CALL SUCCESSFULLY about")
    
})
app.use('/auth',authRoutes)

app.listen(PORT,()=>{
    console.log('SERVER IS RUNNING ON PORT ',PORT);
    // console.log("mongodb uri",process.env.MONGODB_URI);
    
})
