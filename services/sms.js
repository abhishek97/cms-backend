const axios = require('axios')
const hb = require('handlebars')
const fs = require('fs')

const config = require('../config')
const {dltForTemplate} = require('../util/sms')

const SMS = function (smsConfig) {
  const config = {
    loginID: smsConfig.loginID,
    password: smsConfig.password,
    senderid: smsConfig.senderid,
    route_id: smsConfig.route_id,
    Unicode: smsConfig.Unicode
  }
  const uri = smsConfig.uri

  this.send = (receiver, sms, dlt_template_id) => {
    const copyConfig = { ...config }
    copyConfig.text = sms
    copyConfig.mobile = receiver
    copyConfig.Template_id = dlt_template_id

    if (process.env.NODE_ENV != 'production') {
      return console.log("SMS", copyConfig)
    }

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

  const sendToTemplate = (templateName) => (receiver, data) => {
    const template = readAndCompile(templateName)
    const body = template(data)
    return this.send(receiver, body, dltForTemplate(templateName))
  }

  this.sendToCustomer = sendToTemplate('customer_sms')

  this.sendToFieldBoy = sendToTemplate('fieldboy_sms')

  this.sendFeedbackSms = sendToTemplate('customer_feedback')

  return this
}

module.exports = SMS(config.sms)