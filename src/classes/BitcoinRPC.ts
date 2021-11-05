import cryptoRandomString from 'crypto-random-string'
import { config } from 'dotenv'
import { post } from 'superagent'

config()

const { BITCOIND_RPC_PORT } = process.env

export default class BitcoinRPC {
  private _request (data: any, walletId?: string) {
    return post(`http://backend:pass@127.0.0.1:${BITCOIND_RPC_PORT}${walletId ? `/wallet/${walletId}` : ''}`)
      .set('Content-Type', 'text/plain')
      .send(JSON.stringify({ ...data, jsonrpc: '1.0', id: cryptoRandomString({ length: 10 }) }))
  }

  public createWallet (): Promise<any> {
    return this._request({
      method: 'createwallet',
      params: {
        wallet_name: cryptoRandomString({ length: 30 }),
        load_on_startup: true
      }
    })
  }

  public createAddress (walletId: string): Promise<any> {
    return this._request({
      method: 'getnewaddress'
    }, walletId)
  }

  public getBalance (walletId: string): Promise<any> {
    return this._request({
      method: 'getbalance'
    }, walletId)
  }
}

export const bitcoin = new BitcoinRPC()
