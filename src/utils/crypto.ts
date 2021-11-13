import jwt from 'jsonwebtoken'
import keccak256 from 'keccak256'
import { JWT_SECRET, TOKEN_EXPIRE_TIME } from '../constants'
import cryptoRandomString from 'crypto-random-string'
import { UnsecuredUserData, UserData } from '../models'

interface JwtPayload {
  iat: number
  sub: string
  exp: number
}

export class CryptoUtil {
  private static hashfn (data: string) {
    return keccak256(data).toString('hex')
  }

  private static saltfn () {
    return cryptoRandomString({
      length: 10,
      type: 'ascii-printable'
    })
  }

  private static payloadfn (sub: string): JwtPayload {
    return {
      sub,
      iat: Date.now(),
      exp: Date.now() + TOKEN_EXPIRE_TIME
    }
  }

  public static hashPassword (password: string) {
    const salt = this.saltfn()
    const hash = this.hashfn(`${salt}${password}`)

    return { salt, passwd: hash }
  }

  public static verifyPassword (password: string, user: UnsecuredUserData) {
    const { salt, passwd } = user
    const hash = this.hashfn(`${salt}${password}`)

    return hash === passwd
  }

  public static generateToken (user: UserData) {
    const payload = this.payloadfn(user.id)
    return jwt.sign(payload, JWT_SECRET)
  }

  public static verifyToken (token?: string) {
    if (!token) return null
    const [type, str] = token.split(' ')

    if (type !== 'Bearer') return null

    try {
      const data = jwt.verify(str, JWT_SECRET) as JwtPayload

      if (data.exp < Date.now()) return null
      return data.sub
    } catch (_) { return null }
  }
}
