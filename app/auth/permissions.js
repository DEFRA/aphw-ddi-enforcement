const permissions = {
  admin: 'Dog.Index.Admin',
  standard: 'Dog.Index.Standard',
  anyLoggedInUser: ['Dog.Index.Admin', 'Dog.Index.Standard'],
  enforcement: 'Dog.Index.Enforcement'
}

module.exports = permissions
