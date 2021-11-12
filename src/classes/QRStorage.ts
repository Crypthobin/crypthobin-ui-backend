import { readFileSync } from 'fs'
import cryptoRandomString from 'crypto-random-string'
import { QR_EXPIRE_TIME, QR_LOGO_PATH } from '../constants'
import { AwesomeQR, QRErrorCorrectLevel } from 'awesome-qr'

export default class QRStorage {
  private data = new Map<string, string>()

  private async createQR (data: string) {
    const qr = new AwesomeQR({
      logoImage: readFileSync(QR_LOGO_PATH),
      text: data,
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

    return await qr.draw()
  }

  public async get (key: string) {
    const address = this.data.get(key)
    if (!address) {
      return undefined
    }

    return await this.createQR(address) as Buffer
  }

  public async regist (address: string) {
    const key = cryptoRandomString({ length: 32 })

    this.data.set(key, address)
    setTimeout(() => this.data.delete(key), QR_EXPIRE_TIME)

    return key
  }
}

export const qrStorage = new QRStorage()
