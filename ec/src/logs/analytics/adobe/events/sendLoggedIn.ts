import { LoggedInPayload } from './types/LoggedInEvents';

export function sendLoggedIn({ userCode }: LoggedInPayload) {
	try {
		window.sc_f_login_success?.(userCode, 'normal');
	} catch (e) {
		// Do nothing
	}
}
