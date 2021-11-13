import { Router } from 'express'
import { qrStorage } from '../classes'

const router = Router()

router.get('/:key.png', async (req, res) => {
  const { key } = req.params
  const qr = await qrStorage.get(key)

  if (!qr) {
    res.set('Content-Type', 'text/html')
    res.send('Key invaild or expired')
    return
  }

  res.set('Content-Type', 'image/png')
  res.send(qr)
})

export default router
