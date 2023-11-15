import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';
import { ErrorCode } from '@/models/api/constants/ErrorCode';
import { MsmApiErrorResponse } from '@/models/api/msm/MsmApiErrorResponse';

/**
 * Msm API error
 */
export class MsmApiError extends ApiError<MsmApiErrorResponse> {
	constructor(error: AxiosError<MsmApiErrorResponse>) {
		super(error);
		this.name = 'MsmApiError';
	}

	/**
	 * Whether this error contains at least one of the specified error codes or not.
	 * @param errorCodes
	 */
	has(...errorCodes: string[]) {
		if (this.response == null) {
			return false;
		}
		return this.response.errorList.some(
			error => !!error.errorCode && errorCodes.includes(error.errorCode)
		);
	}

	get errorParams() {
		return (errorCode: string) => {
			if (this.response == null) {
				return;
			}
			return this.response.errorList.find(
				error => error.errorCode === errorCode
			)?.errorParameterList;
		};
	}

	get isMovedPermanently() {
		return this.status === 301 && this.has(ErrorCode.MOVED_PERMANENTLY);
	}

	get isBadRequest() {
		return this.status === 400;
	}
}
