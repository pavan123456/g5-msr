const objectUtil = require('../../utilities/object')
module.exports = (app) => {
  app.get('/api/v1/users/me', (req, res) => {
    const { user, userRoles } = req
    res.json(user)
    // res.json(objectUtil.reject({ ...user, roles: userRoles }, ['token', 'userGroupId', 'role', 'id']))
  })
}
