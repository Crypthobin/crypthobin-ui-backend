import morgan from 'morgan'
import express from 'express'
import authRouter from './routers/auth'

const app = express()

app.use(morgan('common'))
app.use('/auth', authRouter)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
