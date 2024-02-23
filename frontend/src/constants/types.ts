export enum roleEnum {
    USER = 'user',
    ADMIN = 'admin',
} 

export interface User {
  email: string;
  id: string;
  name: string;
  profile_picture: string;
  role: roleEnum;
}
