import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDB = async (paylod: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = paylod

  const isUserExist = await prisma.user.findUnique({
    where: { email }
  })

  if (isUserExist) {
    throw new Error("User with this email already exist");
  }
  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: {
          profilePhoto
        }
      }

    }
  })
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  })

  return user
}

const getMyProfileFromDB = async (userId: string) => {

  const user = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    omit: {
      password: true
    },

    include: {
      profile: true
    }

  })
  return user
}

const updateMyprofileInDB = async (userId: string, payload: any) => {
  const { name, profilePhoto, bio } = payload


  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
    
      profile: {
        update: {
          profilePhoto,
          bio
        }
      }
    },
    omit: {
      password:true
    }, include: {
      profile:true
    }
  })
  return updatedUser
}

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyprofileInDB
}