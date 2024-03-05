import { action, makeObservable, observable } from 'mobx';
import { User } from '../constants/types';
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
  };
}
export const userStore = new UserStore();
