export enum PrismaErrorEnum {
  NOT_FOUND = 'P2025', // Record not found
  DUPLICATED = 'P2002', // Unique constraint fails
  FOREIGN_KEY_CONSTRAINT = 'P2003', // Foreign key constraint fails
}

export enum UserRole {
  client = 'client',
  manager = 'manager',
}

export enum Reactions {
  like = 'like',
  none = 'none',
}

export const allowedValidMimeTypes = {
  'image/png': 'png',
  'image/jgp': 'jpg',
  'image/jpeg': 'jpeg',
};
