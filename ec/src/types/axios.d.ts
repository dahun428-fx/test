import 'axios';

declare module 'axios' {
	export interface AxiosRequestConfig {
		startedAt?: number;
	}
}
