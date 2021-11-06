import { json, Router } from 'express'
import authUser from '../middlewares/auth'
import { db } from '../classes/DatabaseClient'
import ENDPOINT_ERRORS from '../constants/errors'

const router = Router()

router.use(json())
router.use(authUser)

router.get('/', async (_, res) => {
  const { userId } = res.locals
  const wallets = await db.listAddressDatas(userId)

  res.send({
    success: true,
    data: wallets
  })
})

router.post('/', async (req, res) => {
  const { userId } = res.locals
  const { explanation, address } = req.body

  if (typeof address !== 'string' || address.length !== 43) {
    return res.status(400).send({
      success: false,
      error: 311,
      message: ENDPOINT_ERRORS[311]
    })
  }

  const explainString =
    typeof explanation === 'string'
      ? explanation
      : ''

  if (explainString.length > 100) {
    return res.status(400).send({
      success: false,
      error: 312,
      message: ENDPOINT_ERRORS[312]
    })
  }

  await db.putAddressData({
    registerId: userId,
    explanation: explainString,
    walletAddress: address
  })

  res.send({
    success: true
  })
})

router.get('/:id', async (req, res) => {
  const { userId } = res.locals
  const { id } = req.params

  const wallet = await db.getAddressData(id)

  if (!wallet) {
    return res.status(400).send({
      success: false,
      error: 321,
      message: ENDPOINT_ERRORS[321]
    })
  }

  if (wallet.registerId !== userId) {
    return res.status(400).send({
      success: false,
      error: 322,
      message: ENDPOINT_ERRORS[322]
    })
  }

  res.send({
    success: true,
    data: wallet
  })
})

router.put('/:id', async (req, res) => {
  const { userId } = res.locals
  const { id } = req.params
  const { explanation } = req.body

  const wallet = await db.getAddressData(id)

  if (!wallet) {
    return res.status(400).send({
      success: false,
      error: 331,
      message: ENDPOINT_ERRORS[331]
    })
  }

  if (wallet.registerId !== userId) {
    return res.status(400).send({
      success: false,
      error: 332,
      message: ENDPOINT_ERRORS[332]
    })
  }

  const explainString =
    typeof explanation === 'string'
      ? explanation
      : ''

  if (explainString.length > 100) {
    return res.status(400).send({
      success: false,
      error: 333,
      message: ENDPOINT_ERRORS[333]
    })
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
    return res.status(400).send({
      success: false,
      error: 341,
      message: ENDPOINT_ERRORS[341]
    })
  }

  if (wallet.registerId !== userId) {
    return res.status(400).send({
      success: false,
      error: 342,
      message: ENDPOINT_ERRORS[342]
    })
  }

  await db.deleteAddressData(id)

  res.send({
    success: true
  })
})

export default router
