import bcrypt, { compare } from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser } from "./auth.interface"
import jwt, { SignOptions } from "jsonwebtoken"
import config from "../../config"
import { jwtUtils } from "../../utils/jwt"






const loginUser = async(payload:ILoginUser) => {
    const { email, password } = payload
    const user = await prisma.user.findUniqueOrThrow({
        where:{email}
    })
    const IsPasswordMatch = await bcrypt.compare(password, user.password)
    if (!IsPasswordMatch) {
        throw new Error("Password is incorrect")

    }
    const jwtPayload = {
     id: user.id,
        role: user.role,
        name: user.name,
        email:user.email
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

export const authServices = {
    loginUser
}