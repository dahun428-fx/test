import { store } from '@/store';
import { selectUser } from '@/store/modules/auth';

export function getUserAttributes() {
	const { userCode, customerCode, purchaseLinkFlag } =
		selectUser(store.getState()) ?? {};
	return { userCode, customerCode, purchaseLinkFlag };
}
