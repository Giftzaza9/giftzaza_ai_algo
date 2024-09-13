import { action, makeObservable, observable } from 'mobx';
import { User } from '../constants/types';
import { fsUserSetter } from '../utils/fullStoryUserSetter';
export class UserStore {
  user: User | undefined;
  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
    });
  }
  setUser = (user: User | undefined) => {
    this.user = user;
    try {
      fsUserSetter?.(user);
    } catch (error) {
      console.error(error);
    }
  };
}
export const userStore = new UserStore();
