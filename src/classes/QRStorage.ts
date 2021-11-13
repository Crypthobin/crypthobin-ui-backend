import { AwesomeQR } from 'awesome-qr'
import cryptoRandomString from 'crypto-random-string'
import { QR_EXPIRE_TIME, QR_GENERATE_OPTION } from '../constants'

export default class QRStorage {
  private data = new Map<string, string>()

  private async createQR (data: string) {
    return new AwesomeQR({
      text: data,
      ...QR_GENERATE_OPTION
    }).draw() as Promise<Buffer>
  }

  public async get (key: string) {
    const address = this.data.get(key)

    if (!address) return undefined
    return await this.createQR(address)
  }

  public async regist (address: string) {
    const key = cryptoRandomString({ length: 32 })

    setTimeout(() =>
      this.data.delete(key), QR_EXPIRE_TIME)

    this.data.set(key, address)
    return key
  }
}

export const qrStorage = new QRStorage()
