import { endpointError } from '../utils'
import { Request, Response } from 'express'

/**
 * creates a not found error
 */
export default function notfound (_: Request, res: Response) {
  res.status(404).send(endpointError('ENDPOINT_NOT_FOUND'))
}
