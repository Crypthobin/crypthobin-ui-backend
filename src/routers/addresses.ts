import { db, bitcoin } from '../classes'
import { json, Router } from 'express'
import { endpointError } from '../utils'
import authUser from '../middlewares/auth'

const router = Router()

router.use(json())
router.use(authUser)

router.get('/', async (_, res) => {
  const { userId } = res.locals
  const wallets = await db.listAddressDatas(userId) as any[]

  for (const walletIndex in wallets) {
    const wallet = wallets[walletIndex]
    const mappedWallet = await db.getWalletDataByAddress(wallet.walletAddress)

    if (!mappedWallet) {
      wallets[walletIndex].otherAddresses = []
      continue
    }

    const otherAddresses = await bitcoin.getAddressGroupings(mappedWallet.id)
    wallets[walletIndex].otherAddresses = otherAddresses.flat().map((v: any) => v[0])
  }

  res.send({
    success: true,
    data: wallets
  })
})

router.post('/', async (req, res) => {
  const { userId } = res.locals
  const { explanation, address } = req.body

  if (typeof address !== 'string' || address.length !== 43) {
    res.status(400).send(endpointError('ADDRESS_INVAILD'))
    return
  }

  const explainString =
    typeof explanation === 'string'
      ? explanation
      : ''

  if (explainString.length > 100) {
    return res.status(400).send(endpointError('EXPLAIN_TOO_LONG'))
  }

  const data = await db.getAddressDataByCtx(userId, address, explainString)

  if (!data) {
    await db.putAddressData({
      registerId: userId,
      explanation: explainString,
      walletAddress: address
    })
  }

  res.send({
    success: true
  })
})

router.get('/:id', async (req, res) => {
  const { userId } = res.locals
  const { id } = req.params

  const wallet = await db.getAddressData(id)
  if (!wallet) {
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (wallet.registerId !== userId) {
    res.status(400).send(endpointError('WALLET_NOT_OWNER'))
    return
  }

  res.send({
    success: true,
    data: wallet
  })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = res.locals
  const { explanation } = req.body

  const wallet = await db.getAddressData(id)

  if (!wallet) {
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (wallet.registerId !== userId) {
    res.status(400).send(endpointError('WALLET_NOT_OWNER'))
    return
  }

  const explainString =
    typeof explanation === 'string'
      ? explanation
      : ''

  if (explainString.length > 100) {
    res.status(400).send(endpointError('EXPLAIN_TOO_LONG'))
    return
  }

  await db.updateAddressExplan(id, explainString)

  res.send({
    success: true
  })
})

router.delete('/:id', async (req, res) => {
  const { userId } = res.locals
  const { id } = req.params

  const wallet = await db.getAddressData(id)

  if (!wallet) {
    res.status(400).send(endpointError('WALLET_NOT_FOUND'))
    return
  }

  if (wallet.registerId !== userId) {
    res.status(400).send(endpointError('WALLET_NOT_OWNER'))
    return
  }

  await db.deleteAddressData(id)

  res.send({
    success: true
  })
})

export default router
