import bcrypt, { compare } from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser } from "./auth.interface"
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config"
import { jwtUtils } from "../../utils/jwt"
import { isArrayBufferView } from "node:util/types"
import { emitWarning } from "node:process"






const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })
    const IsPasswordMatch = await bcrypt.compare(password, user.password)
    if (!IsPasswordMatch) {
        throw new Error("Password is incorrect")

    }
    const jwtPayload = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
    }

    // const accessToken = jwt.sign({jwtPayload }, config.jwt_access_secret , {expiresIn:config.jwt_access_expire}as SignOptions)

    // const refreshToken = jwt.sign({ jwtPayload }, config.jwt_refresh_secret, { expiresIn: config.jwt_refresh_expire } as SignOptions)


    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expire as SignOptions)

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expire as SignOptions)
    return {
        refreshToken,
        accessToken
    }
}

const refreshtoken = async (token: string) => {

    const veryfiyToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret)
    if (!veryfiyToken.success === true) {
        throw new Error("Token is not valied")
    }

    const { id } = veryfiyToken.data as JwtPayload

    const user = await prisma.user.findFirstOrThrow({
        where: { id }
    })
 if (!veryfiyToken.success) {
    throw new Error("Token is not valid");
}
  const jwtPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name
}

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expire as SignOptions)
    return { accessToken }

}




export const authServices = {
    loginUser,
    refreshtoken
}