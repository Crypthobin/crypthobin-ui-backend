import { db } from '../classes'
import { UserData } from '../models'
import { json, Router } from 'express'
import authUser from '../middlewares/auth'
import { CryptoUtil, endpointError } from '../utils'

const router = Router()

router.use(json())

router.get('/check', authUser, (_, res) => {
  res.send({ success: true })
})

router.post('/login', async (req, res) => {
  const { id, password } = req.body
  if ([id, password].some(v => typeof v !== 'string')) {
    res.status(400).json(endpointError('INPUT_FIELD_NOT_FOUND'))
    return
  }

  const user = await db.getUserData(id)

  if (!user) {
    res.status(400).send(endpointError('USER_NOT_EXIST'))
    return
  }

  if (!CryptoUtil.verifyPassword(password, user)) {
    res.status(400).send(endpointError('PASSWORD_INVAILD'))
    return
  }

  const token = CryptoUtil.generateToken(user)

  res.send({
    success: true,
    data: {
      user: <UserData>{
        id: user.id,
        createdAt: user.createdAt
      },
      token
    }
  })
})

router.post('/regist', async (req, res) => {
  const { id, password, passwordCheck } = req.body

  if ([id, password, passwordCheck].some(v => typeof v !== 'string')) {
    res.status(400).json(endpointError('INPUT_FIELD_NOT_FOUND'))

    return
  }

  if (id.length < 6 || id.length > 30) {
    res.status(400).json(endpointError('ID_TOO_SHORT_OR_LONG'))
    return
  }

  if (password.length < 8) {
    res.status(400).json(endpointError('PASSWORD_TOO_SHORT'))

    return
  }

  if (password !== passwordCheck) {
    res.status(400).json(endpointError('PASSWORD_CHECK_FAILD'))
  }

  if (await db.getUserData(id)) {
    res.status(400).json(endpointError('ID_ALREADY_CLAIMED'))
    return
  }

  await db.putUserData({
    id, ...CryptoUtil.hashPassword(password)
  })

  const user = await db.getUserData(id)
  if (!user) return

  const token = CryptoUtil.generateToken(user)

  res.send({
    success: true,
    data: {
      user: <UserData>{
        createdAt: user.createdAt,
        id: user.id
      },
      token
    }
  })
})

export default router
