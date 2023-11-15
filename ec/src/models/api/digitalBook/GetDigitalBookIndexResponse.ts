import { ApiResponse } from '@/models/api/ApiResponse';

export interface GetDigitalBookIndexResponse extends ApiResponse {
	totalCount: number;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
}

export type DigitalBookIndexes = Record<string, number>;
