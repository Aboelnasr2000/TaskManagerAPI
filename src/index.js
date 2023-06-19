import express from 'express';
import { connection } from './db/mongoose.js'
import { userRouter } from './routers/user.js';
import { taskRouter } from './routers/task.js';

const app = express()
const port = process.env.PORT   
connection()

const maintenace = 0

app.use((req, res, next) => {
    if (maintenace) {
        res.status(503).send('Site Under Maintaince')
    } else {
        next()
    }

})

 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Set Listen
app.listen(port, () => {
    console.log("Server is Up on Port " + port)
})
