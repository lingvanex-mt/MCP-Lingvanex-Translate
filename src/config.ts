import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

function getRequiredEnv(param: string | undefined): string {
  if (param === undefined) {
    throw new Error(`${param} is not defined`)
  }
  return param
}

const NODE_ENV = getRequiredEnv(process.env.NODE_ENV || 'development')
const HTTP_PORT = getRequiredEnv(process.env.L7X_HTTP_PORT || '3000')

const TRANSPORT = getRequiredEnv(process.env.L7X_TRANSPORT || 'stdio')

const TRANSLATE_API_URL = getRequiredEnv(process.env.L7X_TRANSLATE_API_URL || '')
const TRANSLATE_API_KEY = getRequiredEnv(process.env.L7X_TRANSLATE_API_KEY || '')

export {
  NODE_ENV,
  HTTP_PORT,
  TRANSPORT,
  TRANSLATE_API_URL,
  TRANSLATE_API_KEY,
}
