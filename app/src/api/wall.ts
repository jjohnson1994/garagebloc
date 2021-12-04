import { API } from "aws-amplify";
import { CreateWallForm, CreateWallRequest } from "core/types";
import {uploadImage} from "./storage";

export const createWall = async (newWall: CreateWallForm) => {
  const { key: imageKey } = await uploadImage(newWall.imageFile[0])

  const body: CreateWallRequest = {
    wallName: newWall.wallName,
    overhangDeg: newWall.overhangDeg,
    widthCm: newWall.widthCm,
    heightCm: newWall.heightCm,
    visibility: newWall.visibility,
    imageKey
  }

  return API.post("super-board", "/walls", { body })
};

export const getWalls = async () => {
  return API.get("super-board", "/walls", {})
};

export const getWall = async (wallId: string) => {
  return API.get("super-board", "/walls", {
    queryStringParameters: {
      wallId
    }
  })
};
