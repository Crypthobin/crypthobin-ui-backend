import morgan from 'morgan'
import express from 'express'
import authRouter from './routers/auth'
import { qrGenerator } from './utils/qr'
import walletRouter from './routers/wallets'
import addressRouter from './routers/addresses'
import notfound from './middlewares/notfound'

const app = express()

app.use(morgan('common'))
app.use('/auth', authRouter)
app.use('/api/wallets', walletRouter)
app.use('/api/addresses', addressRouter)
app.get('/api/qr/:addr.png', qrGenerator)
app.use(notfound)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
