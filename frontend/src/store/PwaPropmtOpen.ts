import { action, makeObservable, observable } from 'mobx';

export class PwaPromptOpenState {
  pwaPromptOpen: boolean = false;
  constructor() {
    makeObservable(this, {
      pwaPromptOpen: observable,
      setPwaPromptOpen: action,
    });
  }
  setPwaPromptOpen = (pwaPromptOpen: boolean) => {
    this.pwaPromptOpen = pwaPromptOpen;
  };
}
export const pwaPromptOpenState = new PwaPromptOpenState();
