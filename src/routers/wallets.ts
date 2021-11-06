import { json, Router } from 'express'
import authUser from '../middlewares/auth'
import { db } from '../classes/DatabaseClient'
import { bitcoin } from '../classes/BitcoinRPC'
import ENDPOINT_ERRORS from '../constants/errors'

const router = Router()

router.use(json())
router.use(authUser)

router.get('/', async (_, res) => {
  const { userId } = res.locals
  const wallets = await db.listWalletDatasByUserId(userId)

  for (const walletIndex in wallets) {
    const wallet = wallets[walletIndex]
    const balance = (await bitcoin.getBalance(wallet.id))?.body?.result || 0

    wallets[walletIndex].balance = balance
  }

  res.send({
    success: true,
    data: wallets
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = res.locals

  const wallets = await db.getWalletData(id)
  if (!wallets) {
    res.status(400).send({
      success: false,
      error: 211,
      message: ENDPOINT_ERRORS[211]
    })
    return
  }

  if (userId !== wallets?.ownerId) {
    res.status(403).send({
      success: false,
      error: 212,
      message: ENDPOINT_ERRORS[212]
    })

    return
  }

  wallets.balance = (await bitcoin.getBalance(id))?.body?.result || 0

  res.send({
    success: true,
    data: wallets
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
  const walletId = walletRes.body?.result?.name

  if (!walletId) {
    res.status(400).send({
      success: false,
      error: 221,
      message: ENDPOINT_ERRORS[221]
    })

    return
  }

  const addressRes = await bitcoin.createAddress(walletRes.body.result.name)
  const walletAddress = addressRes.body?.result

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

export default router
