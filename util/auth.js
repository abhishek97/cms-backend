module.exports =  {
  authTokens: [],
  middleware (req, res, next) {
    const apiKey = req.get('apiKey')
    if (!apiKey || !this.authTokens.includes(apiKey)) return res.sendStatus(401)
    else return next()
  }
}