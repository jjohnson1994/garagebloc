export interface CreateWallForm {
  wallName: string;
  overhangDeg: number;
  widthCm: number;
  heightCm: number;
  imageFile: FileList;
  visibility: string;
}

export interface CreateWallRequest extends Omit<CreateWallForm, "imageFile"> {
  imageKey: string;
}

export interface Wall extends CreateWallRequest {
  wallId: string;
  logCount: number;
  routeCount: number;
  drawing: WallDrawing;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateRouteForm {
  title: string;
  description: string;
  grade: string;
  drawing: {
    schemaVersion: number;
    holds: Hold[];
  };
}

export type HoldLayout = "Splatter" | "Symmetrical" | "Mixed";

export type Hold = {
  id: string;
  points: [number, number][];
  mirrors?: string;
};

export interface WallDrawing {
  schemaVersion: number;
  holds: Hold[];
}

export interface SetupWallForm {
  holdLayout: HoldLayout;
  drawing: WallDrawing;
}

export interface Route extends CreateRouteForm {
  routeId: string;
  wallId: string;
  logCount: number;
  userLogs: Log[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LogRouteForm {
  rating: number;
  comments: string;
  suggestedGrade: string;
}

export interface Log extends LogRouteForm {
  routeId: string;
  wallId: string;
  logId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export enum Visibility {
  public = "public",
  private = "private",
}
