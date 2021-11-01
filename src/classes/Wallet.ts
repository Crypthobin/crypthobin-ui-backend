import { WalletData } from '../models'
import { db } from './DatabaseClient'

export default class Wallet implements WalletData {
  public address: string
  public alias: string
  public createdAt: number
  public ownerId: string

  constructor (data: WalletData) {
    this.address = data.address
    this.alias = data.alias
    this.createdAt = data.createdAt
    this.ownerId = data.ownerId
  }

  public get owner () {
    return db.getUserData(this.ownerId)
  }

  public setAlias (alias: string) {
    this.alias = alias

    return db.updateWalletAlias(this.address, this.alias)
  }

  public static async fromWalletAddress (walletAddress: string) {
    const walletData = await db.getWalletData(walletAddress)

    if (!walletData) throw new Error('Wallet not found')
    return new Wallet(walletData)
  }
}
