import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';

/** Logger payload */
export type LoggedInPayload = {
	userCode: string;
};

/** Log event type */
export type LoggedInEvent = {
	event: 'gaLoginSuccess';
	cd_088: '[login]Login Success';
	cd_151: string;
	cd_183: 'member';
	cd_184: 'login';
	cm_106: 1;
};

/**
 * "Logged in" log
 */
export function loggedIn({ userCode }: LoggedInPayload) {
	EventManager.submit(() => {
		sendEvent<LoggedInEvent>({
			event: 'gaLoginSuccess',
			cd_088: '[login]Login Success',
			cd_151: userCode,
			cd_184: 'login',
			cd_183: 'member',
			cm_106: 1,
		});
	});
}
