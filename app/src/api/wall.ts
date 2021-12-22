import { API } from "aws-amplify";
import { CreateWallForm, CreateWallRequest, SetupWallForm, Wall } from "core/types";
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

export const setupWall = async (wallId: string, newSetup: SetupWallForm) => {
  return API.post("super-board", `/walls/${wallId}/setup`, { body: newSetup })
};

export const getWalls = async () => {
  return API.get("super-board", "/walls", {})
};

export const getWall = async (wallId: string): Promise<{ wall: Wall }> => {
  return API.get("super-board", "/walls", {
    queryStringParameters: {
      wallId
    }
  })
};
