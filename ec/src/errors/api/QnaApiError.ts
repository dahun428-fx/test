import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';
import { QnaApiErrorResponse } from '@/models/api/qna/QnaApiErrorResponse';

export class QnaApiError extends ApiError<QnaApiErrorResponse> {
	constructor(error: AxiosError<QnaApiErrorResponse>) {
		super(error);
		this.name = 'QnaApiError';
	}
}
