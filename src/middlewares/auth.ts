import { endpointError, CryptoUtil } from '../utils'
import { NextFunction, Request, Response } from 'express'

export default function authUser (req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers
  const userId = CryptoUtil.verifyToken(authorization)

  if (!userId) {
    res.status(400).send(endpointError('TOKEN_INVAILD'))
    return
  }

  res.locals.userId = userId
  next()
}
