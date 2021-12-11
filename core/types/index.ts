export interface CreateWallForm {
  wallName: string;
  overhangDeg: number;
  widthCm: number;
  heightCm: number;
  imageFile: FileList;
  visibility: string;
}

export interface CreateWallRequest extends Omit<CreateWallForm, 'imageFile'> {
  imageKey: string;
}

export interface Wall extends CreateWallRequest {
  wallId: string;
  logCount: number;
  routeCount: number;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteForm {
  title: string;
  description: string;
  grade: string;
  drawing: {
    schemaVersion: 1,
    points: [number, number][]
  }
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
