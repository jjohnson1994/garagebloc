import { API } from "aws-amplify";
import { CreateRouteForm } from "core/types";

export const createRoute = async (
  wallId: string,
  newRoute: CreateRouteForm
) => {
  return API.post("super-board", `/walls/${wallId}/routes`, { body: newRoute });
};

export const getRoute = async (routeId: string) => {
  return API.get("super-board", `/routes`, {
    queryStringParameters: {
      routeId
    }
  });
};

export const getRoutes = async (wallId: string) => {
  return API.get("super-board", `/routes`, {
    queryStringParameters: {
      wallId
    }
  });
};
