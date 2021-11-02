export interface UserData {
  id: string
  createdAt: number
}

export interface UnsecuredUserData extends UserData {
  salt: string
  passwd: string
}

export interface WalletData {
  address: string
  ownerId: string
  alias: string
  createdAt: number
}

export interface AddressData {
  id: number
  registerId: string
  walletAddress: string
  explanation: string
  createdAt: number
}

export type TransactionType = 'SEND' | 'RECEIVE'

export interface TransactionData {
  type: TransactionType
  from: string
  to: string
  amount: number
  createdAt: number
}
