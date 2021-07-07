export default function ({ store, route, error }) {
  if (route === '/edit') {
    const roles = store.state.user.user.roles
    if (!roles || !roles.find(role => role.type === 'GLOBAL')) {
      error('user is not GLOBAL')
    }
  }
}
