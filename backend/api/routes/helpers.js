const jwt = require('jsonwebtoken')
const keys = require('../../configs/keys')

const error = err => ({ error: err })
const success = data => ({ success: data })
const unauthorized = resp => s => resp.status(401).json(s)
const forbidden = resp => s => resp.status(403).json(s)
const badReq = resp => s => resp.status(400).json(s)

const getAuthJWT = (req) => 
  req.query.accessKey
    ? req.query.accessKey
    : undefined

const parseAuthJWT = (token) => {
  try {
    const decoded = jwt.verify(token, keys.jwtSecret)
    return success(decoded)
  } catch (_) {
    console.log(_)
    return error("token invalid or expired")
  }
} 

function checkAuth(req, resp, next) {
  const jwt = getAuthJWT(req)
  if (!jwt) return unauthorized(resp)('no access token provided')
  const result = parseAuthJWT(jwt)
  if ('error' in result) return unauthorized(resp)(result.error)
  req.user = result.success
  next()
}

function checkAdmin(req, resp, next) {
  const jwt = getAuthJWT(req)
  if (!jwt) return unauthorized(resp)('no access token provided')
  const result = parseAuthJWT(jwt)
  if ('error' in result) return unauthorized(resp)(result.error)
  req.user = result.success
  if (!(req.user.role === 'admin')) return forbidden(resp)(error("insufficient permissions"))
  next()
}

function checkHairdresser(req, resp, next) {
  const jwt = getAuthJWT(req)
  if (!jwt) return unauthorized(resp)('no access token provided')
  const result = parseAuthJWT(jwt)
  if ('error' in result) return unauthorized(resp)(result.error)
  req.user = result.success
  if (!(req.user.role === 'hairdresser')) return forbidden(resp)(error("insufficient permissions"))
  next()
}

const generateToken = tokenBody => jwt.sign(
  tokenBody, 
  keys.jwtSecret, 
  { expiresIn: '3h' }
)

module.exports = {
  checkAuth,
  checkHairdresser,
  checkAdmin,
  badReq,
  unauthorized,
  forbidden,
  error,
  success,
  generateToken
}