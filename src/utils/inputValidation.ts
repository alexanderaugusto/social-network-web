/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function name(name: string) {
  return name.length >= 3
}

function email(email: string) {
  const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRex.test(email)
}

function password(password: string) {
  return password.length >= 3
}

export default {
  name,
  email,
  password
}
