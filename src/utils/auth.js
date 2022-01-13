import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RolesKey = 'Roles'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRoles() {
 return Cookies.get(RolesKey) && JSON.parse(Cookies.get(RolesKey))
}

export function setRoles(item) {
  const value = JSON.stringify(item)
  return Cookies.set(RolesKey, value)
}

export function removeRoles() {
  return Cookies.remove(RolesKey)
}