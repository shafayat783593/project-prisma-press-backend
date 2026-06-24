import dotenv from "dotenv"

import path from "node:path"
dotenv.config({
    path: path.join(process.cwd(), ".env")
});

export default {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_TOUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expire: process.env.JWT_ACCESS_EXPIRE,
    jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE,
}