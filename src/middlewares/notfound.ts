import { Request, Response } from 'express'
import ENDPOINT_ERRORS from '../constants/errors'

export default function notfound (_: Request, res: Response) {
  res.status(404).send({
    success: false,
    error: 902,
    message: ENDPOINT_ERRORS[902]
  })
}
