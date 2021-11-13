import path from 'path'
import { config } from 'dotenv'

config()

export const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  BITCOIND_RPC_PORT,
  BITCOIND_RPC_USER,
  BITCOIND_RPC_PASS,
  BITCOIND_RPC_HOST
} = process.env

export const TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000

export const QR_EXPIRE_TIME = 24 * 60 * 60 * 1000

export const QR_LOGO_PATH =
  path.join(path.resolve(), 'src', 'assets', 'bob_bi_solid.jpg')

export const DB_CONNECTION_INFO = {
  client: 'mysql',
  connection: {
    host: DATABASE_HOST || 'localhost',
    port: parseInt(DATABASE_PORT || '3306'),
    database: DATABASE_NAME || 'bobowl',
    user: DATABASE_USER || 'bobowl'
  }
}

export const BITCOIND_RPC_URL =
  'http://' +
    `${BITCOIND_RPC_USER || 'backend'}:` +
    `${BITCOIND_RPC_PASS || 'pass'}@` +
    `${BITCOIND_RPC_HOST || 'localhost'}:` +
    `${BITCOIND_RPC_PORT || '8332'}`

export * from './errors'
export * from './qr'
