import { solveToken } from '../utils/crypto'
import ENDPOINT_ERRORS from '../constants/errors'
import { NextFunction, Request, Response } from 'express'

export default function authUser (req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers
  const userId = solveToken(authorization)

  if (!userId) {
    res.status(400).send({
      success: false,
      error: 901,
      message: ENDPOINT_ERRORS[901]
    })

    return
  }

  res.locals.userId = userId
  next()
}
