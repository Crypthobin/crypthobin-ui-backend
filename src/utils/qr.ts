import { readFileSync } from 'fs'
import { AwesomeQR, QRErrorCorrectLevel } from 'awesome-qr'
import { Request, Response } from 'express'
import path from 'path'

const logoPath = path.join(path.resolve(), 'src', 'assets', 'bob_bi_solid.jpg')

export async function qrGenerator (req: Request, res: Response) {
  const { addr } = req.params

  if (addr.length !== 43) {
    res.status(400).send('Invalid address')
    return
  }

  const qr = new AwesomeQR({
    logoImage: readFileSync(logoPath),
    text: addr,
    logoScale: 0.4,
    logoCornerRadius: 0,
    correctLevel: QRErrorCorrectLevel.H,
    version: 6,
    size: 500,
    colorDark: '#0b508a',
    margin: 1,
    components: {
      data: {
        scale: 0.8
      },
      cornerAlignment: {
        scale: 0.8
      },
      timing: {
        scale: 0.8
      }
    }
  })

  res.set('Content-Type', 'image/png')
  res.send(await qr.draw())
}
