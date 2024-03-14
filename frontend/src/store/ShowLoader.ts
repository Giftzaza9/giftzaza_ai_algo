import { action, makeObservable, observable } from 'mobx';

export class LoaderState {
  loading: boolean = false;
  constructor() {
    makeObservable(this, {
      loading: observable,
      setLoading: action,
    });
  }
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };
}
export const loaderState = new LoaderState();
