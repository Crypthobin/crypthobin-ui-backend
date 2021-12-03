import { json, Router } from 'express'
import { endpointError } from '../utils'
import authUser from '../middlewares/auth'
import { db, bitcoin, qrStorage } from '../classes'

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
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (userId !== wallet?.ownerId) {
    res.status(403).send(endpointError('WALLET_NOT_OWNER'))
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
    res.status(400).send(endpointError('ALIAS_INVALID'))
    return
  }

  const walletRes = await bitcoin.createWallet()
  const walletId = walletRes.name

  if (!walletId) {
    res.status(400).send(endpointError('WALLET_GENERATION_FAILD'))
    return
  }

  const addressRes = await bitcoin.createAddress(walletId)
  const walletAddress = addressRes

  if (!walletAddress) {
    res.status(400).send(endpointError('WALLET_GENERATION_FAILD'))
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
    res.status(400).send(endpointError('ADDRESS_INVAILD'))
    return
  }

  if (typeof amount !== 'number' || amount < 0) {
    res.status(400).send(endpointError('AMOUNT_INVAILD'))
    return
  }

  const wallet = await db.getWalletData(walletId)
  if (!wallet) {
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (userId !== wallet.ownerId) {
    res.status(403).send(endpointError('WALLET_NOT_OWNER'))
    return
  }

  const balance = await bitcoin.getBalance(wallet.id)
  if (balance < amount) {
    res.status(400).send(endpointError('LOW_BALANCE'))
    return
  }

  const resp = await bitcoin.transit(wallet.id, to, amount)
  if (!resp) {
    res.status(400).send(endpointError('TOO_SMALL_AMOUNT'))
    return
  }

  res.send({
    success: true
  })
})

router.get('/:walletId/transactions', async (req, res) => {
  const { userId } = res.locals
  const { walletId } = req.params
  const { count, page } = req.query

  if (!count || !page || typeof count !== 'string' || typeof page !== 'string') {
    res.status(400).send(endpointError('PARAMS_INVAILD'))
    return
  }

  const wallet = await db.getWalletData(walletId)
  if (!wallet) {
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (userId !== wallet.ownerId) {
    res.status(403).send(endpointError('WALLET_NOT_OWNER'))
    return
  }

  const transactions = await bitcoin.getTransactions(wallet.id, count, page)
  if (!transactions) return res.send({ success: true, data: [] })

  const filteredTransactions =
    transactions.filter((v: any) =>
      ['send', 'receive'].includes(v.category))

  res.send({
    success: true,
    data: filteredTransactions
  })
})

export default router
