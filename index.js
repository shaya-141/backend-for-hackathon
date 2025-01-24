import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from "dotenv";
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
    console.log('fetch successfull');
    res.send("fetch / successfully")
    
})

app.listen(PORT,()=>{
    console.log('SERVER IS RUNNING ON PORT ',PORT);
    // console.log("mongodb uri",process.env.MONGODB_URI);
    
})
