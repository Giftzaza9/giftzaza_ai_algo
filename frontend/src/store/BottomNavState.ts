import { action, makeObservable, observable } from 'mobx';
import { bottomNavHidePaths } from '../constants/constants';

const path = window.location.pathname;
export class BottomNavState {
  isVisible: boolean = (bottomNavHidePaths.some((el) => path.includes(el))) ? false : true;
  constructor() {
    makeObservable(this, {
      isVisible: observable,
      setIsVisible: action,
    });
  }
  setIsVisible = (isVisible: boolean) => {
    this.isVisible = isVisible;
  };
}
export const bottomNavState = new BottomNavState();
