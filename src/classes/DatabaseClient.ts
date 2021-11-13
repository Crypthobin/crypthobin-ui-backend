import knex, { Knex } from 'knex'
import { config } from 'dotenv'
import { AddressData, UnsecuredUserData, WalletData } from 'models'

config()

export default class DatabaseClient {
  public db: Knex

  constructor () {
    this.db = knex({
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT!) || 3306,
        database: process.env.DATABASE_NAME || 'bobowl',
        user: process.env.DATABASE_USER || 'bobowl'
      }
    })
  }

  public async getUserCount (): Promise<number> {
    return ((await this.db.count('user_id').from('users')) as any[])[0]['count(`user_id`)']
  }

  /**
   * 보안 정보가 포함된 유저 정보를 얻습니다.
   */
  public async getUserData (userId: string): Promise<UnsecuredUserData | undefined> {
    const [user] = await this.db
      .select('*')
      .from('users')
      .where({ user_id: userId })
      .limit(1)

    if (!user) return undefined

    return {
      id: user.user_id,
      passwd: user.user_passwd,
      salt: user.user_salt,
      createdAt: user.user_date
    }
  }

  /**
   * 유저정보를 추가합니다.
   */
  public async putUserData (data: Omit<UnsecuredUserData, 'createdAt'>): Promise<void> {
    if (data.id.length < 6 || data.id.length > 30) {
      throw new Error('ID is too short or long')
    }

    if (data.passwd.length !== 64 && data.salt.length !== 10) {
      throw new Error('Password or salt is invalid')
    }

    if (await this.getUserData(data.id)) {
      throw new Error('User already exists')
    }

    await this.db
      .insert({
        user_id: data.id,
        user_passwd: data.passwd,
        user_salt: data.salt
      }).into('users')
  }

  /**
   * 받은 ID를 가지고 있는 지갑 정보를 얻습니다.
   */
  public async getWalletData (walletId: string): Promise<WalletData | undefined> {
    const [wallet] = await this.db
      .select('*')
      .from('wallets')
      .where({ wallet_id: walletId })

    if (!wallet) return undefined

    return {
      id: wallet.wallet_id,
      address: wallet.wallet_addr,
      ownerId: wallet.user_id,
      balance: 0,
      qrKey: '',
      alias: wallet.wallet_alias,
      createdAt: wallet.wallet_date
    }
  }

  /**
   * 유저 아이디에 가입된 지갑 목록을 얻습니다.
   */
  public async listWalletDatasByUserId (userId: string): Promise<WalletData[]> {
    const wallets = await this.db
      .select('*')
      .from('wallets')
      .where({ user_id: userId })

    return wallets.map((v) => ({
      id: v.wallet_id,
      address: v.wallet_addr,
      ownerId: v.user_id,
      balance: 0,
      qrKey: '',
      alias: v.wallet_alias,
      createdAt: v.wallet_date
    }))
  }

  /**
   * 지갑 정보를 추가합니다.
   */
  public async putWalletData (data: Omit<WalletData, 'createdAt' | 'balance'>): Promise<void> {
    if (data.address.length !== 43) {
      throw new Error('Address is invalid')
    }

    if (data.alias.length < 1 || data.alias.length > 50) {
      throw new Error('Alias is too short or long')
    }

    if (!this.getUserData(data.ownerId)) {
      throw new Error('User does not exist')
    }

    await this.db
      .insert({
        wallet_addr: data.address,
        user_id: data.ownerId,
        wallet_id: data.id,
        wallet_alias: data.alias
      }).into('wallets')
  }

  /**
   * 지갑 이름을 수정합니다.
   */
  public async updateWalletAlias (walletId: string, alias: string): Promise<void> {
    if (alias.length < 1 || alias.length > 50) {
      throw new Error('Alias is too short or long')
    }

    if (!this.getWalletData(walletId)) {
      throw new Error('Wallet does not exist')
    }

    await this.db
      .update({ wallet_alias: alias })
      .from('wallets')
      .where({ wallet_addr: walletId })
  }

  /**
   * 지갑을 등록 해제합니다.
   */
  public async deleteWalletData (walletId: string): Promise<void> {
    if (!this.getWalletData(walletId)) {
      throw new Error('Wallet does not exist')
    }

    await this.db
      .delete()
      .from('wallets')
      .where({ wallet_addr: walletId })
  }

  /**
   * 주소 정보를 얻습니다.
   */
  public async getAddressData (addressId: string): Promise<AddressData | undefined> {
    const [addr] = await this.db
      .select('*')
      .from('addresses')
      .where({ address_id: addressId })

    if (!addr) return undefined

    return {
      id: addr.address_id,
      registerId: addr.user_id,
      walletAddress: addr.wallet_addr,
      explanation: addr.address_explan,
      createdAt: addr.address_date
    }
  }

  /**
   * userId가 등록한 번호부 목록을 얻습니다.
   */
  public async listAddressDatas (userId: string): Promise<AddressData[]> {
    if (userId.length < 6 || userId.length > 30) {
      throw new Error('ID is too short or long')
    }

    if (!this.getUserData(userId)) {
      throw new Error('User does not exist')
    }

    const addresses = await this.db
      .select('*')
      .from('addresses')
      .where({ user_id: userId })

    return addresses.map((v) => ({
      id: v.address_id,
      createdAt: v.address_date,
      registerId: v.user_id,
      explanation: v.address_explan,
      walletAddress: v.wallet_addr
    }))
  }

  /**
   * 주소 정보를 추가합니다.
   */
  public async putAddressData (data: Omit<AddressData, 'createdAt' | 'id'>): Promise<void> {
    if (data.walletAddress.length !== 43) {
      throw new Error('Address is invalid')
    }

    if (data.explanation.length > 100) {
      throw new Error('Explanation is too long')
    }

    await this.db
      .insert({
        wallet_addr: data.walletAddress,
        user_id: data.registerId,
        address_explan: data.explanation
      }).into('addresses')
  }

  /**
   * 주소 정보를 삭제합니다.
   */
  public async deleteAddressData (addressId: string): Promise<void> {
    if (!this.getAddressData(addressId)) {
      throw new Error('Address does not exist')
    }

    await this.db
      .delete()
      .from('addresses')
      .where({ address_id: addressId })
  }

  /**
   * 주소 정보를 수정합니다.
   */
  public async updateAddressExplan (addressId: string, explanation: string): Promise<void> {
    if (explanation.length > 100) {
      throw new Error('Explanation is too long')
    }

    if (!this.getAddressData(addressId)) {
      throw new Error('Address does not exist')
    }

    await this.db
      .update({ address_explan: explanation })
      .from('addresses')
      .where({ address_id: addressId })
  }
}

export const db = new DatabaseClient()
