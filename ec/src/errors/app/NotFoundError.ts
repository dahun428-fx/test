import { ApplicationError } from '@/errors/ApplicationError';

/**
 * Not found error
 */
export class NotFoundError extends ApplicationError {
	constructor(target: string, id?: string | number) {
		super(`Not Found "${target}": [${id}]`);
		this.name = 'NotFoundError';
	}
}
