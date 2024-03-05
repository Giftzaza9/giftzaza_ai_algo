import { action, makeObservable, observable } from 'mobx';
export class BottomNavState {
  isVisible: boolean = true;
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
