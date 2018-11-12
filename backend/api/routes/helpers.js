function checkAuth(req, resp, next) {
  if (!req.isAuthenticated()) return resp.status(401).json("not logged in")
  next()
}

function checkAdmin(req, resp, next) {
  if (!req.user) return resp.status(401).json("not logged in")
  if (!req.user.role === 'admin') return resp.status(403).json("this can only be used with admin account")
  next()
}

module.exports = {
  checkAuth,
  checkAdmin
}