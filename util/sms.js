module.exports = {
  dltForTemplate(templateName) {
    switch (templateName) {
      case 'customer_sms':  return '1207161797734377058';
      case 'fieldboy_sms': return '1207161797712353963';
      case 'customer_feedback': return '1207161797744230949'
      default: return ''
    }
  }
}