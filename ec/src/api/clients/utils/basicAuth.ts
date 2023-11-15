import { AxiosBasicCredentials } from 'axios';

export function getBasicAuth(): AxiosBasicCredentials | undefined {
	const onBrowser = typeof window !== 'undefined';

	if (onBrowser) {
		return undefined;
	}

	// NOTE: In PROD env, the following env vars should not be set.
	// They are only for DEV, STG, CHK0.
	const { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } = process.env;
	if (BASIC_AUTH_USER && BASIC_AUTH_PASSWORD) {
		return {
			username: BASIC_AUTH_USER,
			password: BASIC_AUTH_PASSWORD,
		};
	}
}
