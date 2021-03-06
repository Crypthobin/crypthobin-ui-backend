import morgan from 'morgan'
import express from 'express'
import qrRouter from './routers/qr'
import authRouter from './routers/auth'
import infoRouter from './routers/info'
import walletRouter from './routers/wallets'
import addressRouter from './routers/addresses'
import notfound from './middlewares/notfound'

const app = express()

// logger middleware
app.use(morgan('common'))

// endpoint routers
app.use('/qr', qrRouter)
app.use('/auth', authRouter)
app.use('/api/info', infoRouter)
app.use('/api/wallets', walletRouter)
app.use('/api/addresses', addressRouter)

// 404 handler
app.use(notfound)

app.listen(3000, () =>
  console.log('Server is running on port 3000'))
