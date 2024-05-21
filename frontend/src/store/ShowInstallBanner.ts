import { action, makeObservable, observable } from 'mobx';
import { isMobileBrowser } from '../utils/helperFunctions';

const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any)?.standalone;

export class ShowInstallBannerState {
  visible: boolean = (isMobileBrowser() && !isInstalled);
  constructor() {
    makeObservable(this, {
      visible: observable,
      setVisible: action,
    });
  }
  setVisible = (visible: boolean) => {
    this.visible = visible;
  };
}
export const showInstallBannerState = new ShowInstallBannerState();
