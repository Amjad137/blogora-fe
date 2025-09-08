export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface IBaseEntity {
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy?: string;
  updatedBy?: string;
  deleted?: boolean;
  deletedAt?: string; // ISO date string
  deletedBy?: string;
}
