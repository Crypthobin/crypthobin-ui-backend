import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import keccak256 from 'keccak256'
import { TOKEN_EXPIRE_TIME } from '../constants'
import cryptoRandomString from 'crypto-random-string'
import { UnsecuredUserData, UserData } from '../models'

config()

interface JwtPayload {
  iat: number
  sub: string
  exp: number
}

export function verifyPassword (password: string, user: UnsecuredUserData) {
  return keccak256(user.salt + password).toString('hex') === user.passwd
}

export function hashPassword (password: string) {
  const salt = cryptoRandomString({ length: 10, type: 'ascii-printable' })
  const passwd = keccak256(salt + password).toString('hex')

  return { salt, passwd }
}

export function createToken (user: UserData) {
  return jwt.sign({
    sub: user.id,
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRE_TIME
  }, process.env.JWT_SECRET!)
}

export function solveToken (token?: string) {
  if (!token) return undefined
  const [type, str] = token.split(' ')

  if (type !== 'Bearer') return undefined

  try {
    const data = jwt.verify(str, process.env.JWT_SECRET!) as JwtPayload
    if (data.exp < Date.now()) {
      return undefined
    }

    return data.sub
  } catch (e) {
    return undefined
  }
}
