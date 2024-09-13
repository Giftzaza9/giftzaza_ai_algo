import { User } from '../constants/types';

export const fsUserSetter = (user?: User) => {
  if ((window as typeof window & { FS: any })?.FS && user) {
    (window as typeof window & { FS: any })?.FS?.('setIdentity', {
      uid: user.id, // Unique ID for the user in your app
      properties: {
        displayName: user.name,
        email: user.email,
      },
    });
  }
};
