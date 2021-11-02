import morgan from 'morgan'
import express from 'express'
import authRouter from './routers/auth'
import walletRouter from './routers/wallets'
import notfound from './middlewares/notfound'

const app = express()

app.use(morgan('common'))
app.use('/auth', authRouter)
app.use('/wallets', walletRouter)
app.use(notfound)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
