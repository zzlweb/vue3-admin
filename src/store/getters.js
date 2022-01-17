/**
 * @description:定义公共getters
 */

const getters = { 
  token: state => state.user.token,
  roles: state => state.user.roles
}

export default getters
