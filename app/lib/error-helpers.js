const errorPusherDefault = (errors, model) => {
  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      const prop = model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}
module.exports = {
  errorPusherDefault
}
