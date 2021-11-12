import { json, Router } from 'express'
import authUser from '../middlewares/auth'
import { db } from '../classes/DatabaseClient'
import { bitcoin } from '../classes/BitcoinRPC'
import { qrStorage } from '../classes/QRStorage'
import ENDPOINT_ERRORS from '../constants/errors'

const router = Router()

router.use(json())
router.use(authUser)

router.get('/', async (_, res) => {
  const { userId } = res.locals
  const wallets = await db.listWalletDatasByUserId(userId)

  for (const walletIndex in wallets) {
    const wallet = wallets[walletIndex]

    const balance = await bitcoin.getBalance(wallet.id) || 0
    const qrKey = await qrStorage.regist(wallet.address)

    wallets[walletIndex].balance = balance
    wallets[walletIndex].qrKey = qrKey
  }

  res.send({
    success: true,
    data: wallets
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = res.locals

  const wallet = await db.getWalletData(id)
  if (!wallet) {
    res.status(400).send({
      success: false,
      error: 211,
      message: ENDPOINT_ERRORS[211]
    })
    return
  }

  if (userId !== wallet?.ownerId) {
    res.status(403).send({
      success: false,
      error: 212,
      message: ENDPOINT_ERRORS[212]
    })

    return
  }

  wallet.balance = await bitcoin.getBalance(id) || 0
  wallet.qrKey = await qrStorage.regist(wallet.address)

  res.send({
    success: true,
    data: wallet
  })
})

router.post('/', async (req, res) => {
  const { userId: ownerId } = res.locals
  const { alias } = req.body

  if (typeof alias !== 'string' || alias.length < 1 || alias.length > 50) {
    res.status(400).send({
      success: false,
      error: 223,
      message: ENDPOINT_ERRORS[223]
    })

    return
  }

  const walletRes = await bitcoin.createWallet()
  const walletId = walletRes.name

  if (!walletId) {
    res.status(400).send({
      success: false,
      error: 221,
      message: ENDPOINT_ERRORS[221]
    })

    return
  }

  const addressRes = await bitcoin.createAddress(walletId)
  const walletAddress = addressRes

  if (!walletAddress) {
    res.status(400).send({
      success: false,
      error: 222,
      message: ENDPOINT_ERRORS[222]
    })

    return
  }

  await db.putWalletData({
    address: walletAddress,
    id: walletId,
    ownerId,
    qrKey: await qrStorage.regist(walletAddress),
    alias
  })

  res.status(201).send({
    success: true,
    data: {
      address: walletAddress,
      id: walletId,
      alias
    }
  })
})

router.post('/:walletId/remittance', async (req, res) => {
  const { userId } = res.locals
  const { walletId } = req.params
  const { to, amount } = req.body

  if (typeof to !== 'string' || to.length !== 43) {
    res.status(400).send({
      success: false,
      error: 231,
      message: ENDPOINT_ERRORS[231]
    })

    return
  }

  if (typeof amount !== 'number' || amount < 0) {
    res.status(400).send({
      success: false,
      error: 232,
      message: ENDPOINT_ERRORS[232]
    })

    return
  }

  const wallet = await db.getWalletData(walletId)
  if (!wallet) {
    res.status(400).send({
      success: false,
      error: 233,
      message: ENDPOINT_ERRORS[233]
    })

    return
  }

  if (userId !== wallet.ownerId) {
    res.status(403).send({
      success: false,
      error: 234,
      message: ENDPOINT_ERRORS[234]
    })

    return
  }

  const balance = await bitcoin.getBalance(wallet.id)
  if (balance < amount) {
    res.status(400).send({
      success: false,
      error: 235,
      message: ENDPOINT_ERRORS[235]
    })

    return
  }

  await bitcoin.transit(wallet.id, to, amount)
  res.send({
    success: true
  })
})

router.get('/:walletId/transactions', async (req, res) => {
  const { userId } = res.locals
  const { walletId } = req.params

  const wallet = await db.getWalletData(walletId)
  if (!wallet) {
    res.status(400).send({
      success: false,
      error: 241,
      message: ENDPOINT_ERRORS[241]
    })

    return
  }

  if (userId !== wallet.ownerId) {
    res.status(403).send({
      success: false,
      error: 242,
      message: ENDPOINT_ERRORS[242]
    })

    return
  }

  const transactions = await bitcoin.getTransactions(wallet.id)

  const filteredTransactions =
    transactions.filter((v: any) =>
      ['send', 'receive'].includes(v.category))

  res.send({
    success: true,
    data: filteredTransactions
  })
})

export default router
