import cryptoRandomString from 'crypto-random-string'
import { config } from 'dotenv'
import { post } from 'superagent'

config()

const { BITCOIND_RPC_PORT } = process.env

export default class BitcoinRPC {
  private async _request (data: any, walletId?: string) {
    const res = await post(`http://backend:pass@127.0.0.1:${BITCOIND_RPC_PORT}${walletId ? `/wallet/${walletId}` : ''}`)
      .set('Content-Type', 'text/plain')
      .send(JSON.stringify({ ...data, jsonrpc: '1.0', id: cryptoRandomString({ length: 10 }) }))

    return res.body?.result
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

  public transit (walletId: string, toAddress: string, amount: number): Promise<any> {
    return this._request({
      method: 'send',
      params: [{ [toAddress]: amount }]
    }, walletId)
  }

  public getTransactions (walletId: string): Promise<any> {
    return this._request({
      method: 'listtransactions'
    }, walletId)
  }

  public getBlockCount (): Promise<number> {
    return this._request({
      method: 'getblockcount'
    })
  }

  public getNodeCount (): Promise<number> {
    return this._request({
      method: 'getconnectioncount'
    })
  }
}

export const bitcoin = new BitcoinRPC()