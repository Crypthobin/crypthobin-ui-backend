import keccak256 from 'keccak256'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import cryptoRandomString from 'crypto-random-string'
import { UnsecuredUserData, UserData } from '../models'

config()

interface JwtPayload {
  iat: number
  sub: string
}

export function verifyPassword (password: string, user: UnsecuredUserData) {
  return keccak256(user.salt + password) === user.passwd
}

export function hashPassword (password: string) {
  const salt = cryptoRandomString({ length: 10, type: 'ascii-printable' })
  const passwd = keccak256(salt + password)

  return { salt, passwd }
}

export function createToken (user: UserData) {
  return jwt.sign({
    sub: user.id,
    iat: Date.now()
  }, process.env.JWT_SECRET!)
}

export function solveToken (token: string) {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    return data.sub
  } catch (e) {
    return undefined
  }
}
