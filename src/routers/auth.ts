import { json, Router } from 'express'
import { UserData } from '../models'
import { db } from '../classes/DatabaseClient'
import ENDPOINT_ERRORS from '../constants/errors'
import { createToken, hashPassword, verifyPassword } from '../utils/crypto'

const router = Router()

router.use(json())

router.post('/login', async (req, res) => {
  const { id, password } = req.body
  if (!id || !password) {
    res.status(400).json({
      success: false,
      error: 103,
      message: ENDPOINT_ERRORS[103]
    })

    return
  }

  const user = await db.getUserData(id)

  if (!user) {
    res.status(400).send({
      success: false,
      error: 101,
      message: ENDPOINT_ERRORS[101]
    })

    return
  }

  if (!verifyPassword(password, user)) {
    res.status(400).send({
      success: false,
      error: 102,
      message: ENDPOINT_ERRORS[102]
    })

    return
  }

  const token = createToken(user)

  res.send({
    success: true,
    user: <UserData>{
      createdAt: user.createdAt,
      id: user.id
    },
    token
  })
})

router.post('/regist', async (req, res) => {
  const { id, password, passwordCheck } = req.body

  if (!id || !password || !passwordCheck) {
    res.status(400).json({
      success: false,
      error: 114,
      message: ENDPOINT_ERRORS[114]
    })

    return
  }

  if (id.length > 30) {
    res.status(400).json({
      success: false,
      error: 112,
      message: ENDPOINT_ERRORS[112]
    })

    return
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      error: 113,
      message: ENDPOINT_ERRORS[113]
    })

    return
  }

  if (password !== passwordCheck) {
    res.status(400).json({
      success: false,
      error: 115,
      message: ENDPOINT_ERRORS[115]
    })
  }

  if (await db.getUserData(id)) {
    res.status(400).json({
      success: false,
      error: 110,
      message: ENDPOINT_ERRORS[111]
    })

    return
  }

  const hashed = hashPassword(password)

  await db.putUserData({
    id, passwd: hashed.passwd, salt: hashed.salt
  })

  const user = await db.getUserData(id)
  if (!user) return

  const token = createToken(user)

  res.send({
    success: true,
    user: <UserData>{
      createdAt: user.createdAt,
      id: user.id
    },
    token
  })
})
