import { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import { solveToken } from 'utils/crypto'
import ENDPOINT_ERRORS from 'constants/errors'

function authUserFn (req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies
  const userId = solveToken(token)

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

export default [cookieParser, authUserFn]
