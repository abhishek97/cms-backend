module.exports =  {
  middleware (req, res, next) {
    const apiKey = req.get('apiKey')
    if (!apiKey || !global.authTokens.includes(apiKey)) return res.sendStatus(401)
    else return next()
  }
}