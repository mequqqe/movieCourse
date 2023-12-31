import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import * as path from 'path'

// routes
import streamRouter from './modules/stream/stream.controller'   
import contentRouter from './modules/content/content.controller'    


const app = express()
app.use(cors())
app.use(express.json())
app.use(logger('dev'))
//app.set('views', path.join(__dirname, 'views') )


app.use('/stream', streamRouter)
app.use('/content', contentRouter)
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})  

