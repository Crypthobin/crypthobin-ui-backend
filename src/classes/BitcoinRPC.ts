import { post } from 'superagent'
import { BITCOIND_RPC_URL } from '../constants'
import cryptoRandomString from 'crypto-random-string'

export default class BitcoinRPC {
  private async _request (data: any, walletId?: string) {
    const url = `${BITCOIND_RPC_URL}${walletId ? `/wallet/${walletId}` : ''}`

    try {
      const res = await post(url)
        .set('Content-Type', 'text/plain')
        .send(JSON.stringify({
          ...data,
          jsonrpc: '1.0',
          id: cryptoRandomString({ length: 10 })
        }))

      return res.body?.result
    } catch (e: any) {
      return null
    }
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

  public getTransactions (walletId: string, count: string, page: string): Promise<any> {
    return this._request({
      method: 'listtransactions',
      params: [count, parseInt(page) * parseInt(count)]
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

  public getNthBlockHash (n: number): Promise<string> {
    return this._request({
      method: 'getblockhash',
      params: [n]
    })
  }

  public getBlockFromHash (hash: string): Promise<any> {
    return this._request({
      method: 'getblock',
      params: [hash, 2]
    })
  }
}

export const bitcoin = new BitcoinRPC()
