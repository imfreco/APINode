const { generateToken } = require("../helpers/jwt.helper")
let _userService = null

class AuthService {
  constructor({ UserService }) {
    _userService = UserService
  }

  async signUp(user) {
    const { username } = user
    const userExist = await _userService.getUserByUsername(username)
    if (userExist) {
      const error = new Error()
      error.status = 401
      error.message = "User already exist"
      throw error
    }

    return await _userService.create(user)
  }

  async signIn(user) {
    const { username, password } = user
    const userExist = await _userService.getUserByUsername(username)
    if (!userExist) {
      const error = new Error()
      error.status = 401
      error.message = "User doesn't exist"
      throw error
    }

    const validatedPassword = userExist.comparePasswords(password)

    if (!validatedPassword) {
      const error = new Error()
      error.status = 400
      error.message = "Invalid password"
      throw error
    }

    const userToEncode = {
      username: userExist.username,
      id: userExist._id
    }

    const token = generateToken(userToEncode)

    return { token, user: userExist }
  }
}

module.exports = AuthService
