import { action, makeObservable, observable } from 'mobx';
export class UserStore {
	user: any = {};
	constructor() {
		makeObservable(this, {
			user: observable,
			setUser: action,
		});
	}
	setUser = (user: any) => {
		this.user = user;
	};
}
export const userStore = new UserStore();
