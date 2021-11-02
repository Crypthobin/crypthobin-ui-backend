import { json, Router } from 'express'
import authUser from '../middlewares/auth'
import { db } from '../classes/DatabaseClient'

const router = Router()

router.use(json())
router.use(authUser)

router.get('/', async (_, res) => {
  const { userId } = res.locals
  const wallets = await db.listWalletDatasByUserId(userId)

  res.send({
    success: true,
    data: wallets
  })
})

// router.post('/', async (req, res) => {
//   const { userId } = res.locals
// })

export default router
