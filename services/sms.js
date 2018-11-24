const axios = require('axios')
const hb = require('handlebars')
const fs = require('fs')

const config = require('../config')

const SMS = function (smsConfig) {
  const config = {
    loginID: smsConfig.loginID,
    password: smsConfig.password,
    senderid: smsConfig.senderid,
    route_id: smsConfig.route_id,
    Unicode: smsConfig.Unicode
  }
  const uri = smsConfig.uri

  this.send = (receiver, sms) => {
    const copyConfig = { ...config }
    copyConfig.text = sms
    copyConfig.mobile = receiver
    return axios.get(uri, {
      params: copyConfig,
      json: true
    })
  
  }

  const readAndCompile = (templateName) => {
    const source = fs.readFileSync(`templates/${templateName}.hbs`).toString('utf-8')
    const template = hb.compile(source)
    return template
  }

  this.sendToCustomer = (receiver, data) => {
    const template = readAndCompile('customer_sms')
    const body = template(data)
    return this.send(receiver, body)
  }

  this.sendToFieldBoy = (receiver, data) => {
    const template = readAndCompile('fieldboy_sms')
    const body = template(data)
    return this.send(receiver, body)
  }

  return this
}

module.exports = SMS(config.sms)