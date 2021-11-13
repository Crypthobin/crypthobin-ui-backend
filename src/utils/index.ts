import { ENDPOINT_ERRORS, ENDPOINT_ERRORS_TYPE } from '../constants'

interface EndpointError {
  success: false
  error: number
  message: string
}

export function endpointError (code: ENDPOINT_ERRORS_TYPE): EndpointError {
  return {
    success: false,
    error: ENDPOINT_ERRORS[code],
    message: code
  }
}

export * from './crypto'
