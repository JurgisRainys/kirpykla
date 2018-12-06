const jwt = require('jsonwebtoken')
const keys = require('../../configs/keys')

const error = err => ({ error: err })
const success = data => ({ success: data })
const unauthorized = resp => s => resp.status(401).json(s)
const forbidden = resp => s => resp.status(403).json(s)
const badReq = resp => s => resp.status(400).json(s)

const parseCookieJWT = (req) => {
  try {
    if (!(req.cookies && req.cookies.authJWT)) return error('not logged in')
    const decoded = jwt.verify(req.cookies.authJWT, keys.jwtSecret)
    return success(decoded)
  } catch (_) {
    return error("token invalid or expired")
  }
} 

function checkAuth(req, resp, next) {
  const result = parseCookieJWT(req)
  if ('error' in result) return unauthorized(resp)(result.error)
  req.user = result.success
  next()
}

function checkAdmin(req, resp, next) {
  const result = parseCookieJWT(req)
  if ('error' in result) return unauthorized(resp)(result)
  req.user = result.success
  if (!(req.user.role === 'admin')) return forbidden(resp)(error("insufficient permissions"))
  next()
}

const generateToken = tokenBody => jwt.sign(
  tokenBody, 
  keys.jwtSecret, 
  { expiresIn: '3h' }
)

module.exports = {
  checkAuth,
  checkAdmin,
  badReq,
  unauthorized,
  forbidden,
  error,
  success,
  generateToken
}