import { ApplicationError } from '@/errors/ApplicationError';

export class TimerCancelError extends ApplicationError {
	constructor(timerName: string) {
		super(`Timer canceled (timerName: ${timerName}).`);
		this.name = 'TimerCancelError';
	}
}
