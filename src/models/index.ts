export interface UserData {
  id: string
  createdAt: number
}

export interface UnsecuredUserData extends UserData {
  salt: string
  passwd: string
}

export interface WalletData {
  id: string
  address: string
  ownerId: string
  alias: string
  balance: number
  qrKey: string
  createdAt: number
}

export interface AddressData {
  id: number
  registerId: string
  walletAddress: string
  explanation: string
  createdAt: number
}
