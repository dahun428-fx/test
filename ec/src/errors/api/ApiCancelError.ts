import { ApplicationError } from '@/errors//ApplicationError';

/**
 * Api aborted error
 */
export class ApiCancelError extends ApplicationError {
	constructor() {
		super('Api has been canceled.');
		this.name = 'ApiCancelError';
	}
}
