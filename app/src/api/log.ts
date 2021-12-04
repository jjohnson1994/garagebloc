import { API } from "aws-amplify";
import { LogRouteForm } from "core/types";

export const createLog = async (
  wallId: string,
  routeId: string,
  log: LogRouteForm
) => {
  return API.post("super-board", `/walls/${wallId}/routes/${routeId}/logs`, { body: log });
};
