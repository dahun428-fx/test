import { CancelToken } from 'axios';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { getGenerationStatus } from '@/api/services/cadenas/getGenerationStatus';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';
import { Logger } from '@/logs/datadog';
import { GetGenerationStatusResponse } from '@/models/api/cadenas/generationStatus/GetGenerationStatusResponse';
import { MAX_CADENAS_RETRY } from '@/utils/domain/cad/cadenas';
import { useTimer } from '@/utils/timer';

/** Get CADENAS zip file URL */
export const useGetCadenasFileUrl = () => {
	const timer = useTimer();

	const getCadenasFileUrl = useCallback(
		async (
			url: string,
			token?: CancelToken
		): Promise<GetGenerationStatusResponse | undefined> => {
			let retryCount = 0;
			let response: GetGenerationStatusResponse | undefined;

			// polling
			while (true) {
				try {
					if (retryCount >= MAX_CADENAS_RETRY) {
						if (response && response.expired) {
							Logger.warn(
								`CADENAS 3D CAD Download: EXCEEDS_RETRY_UPPER_LIMIT expired response with url=${url}`
							);
							return;
						}

						const urlObject = new URL(url);
						const params = new URLSearchParams(urlObject.searchParams);
						const timestamp = params.get('_');

						// NOTE: Temporary set date of expiry is one day after starting to download 3D CAD from CADENAS
						const timestampNumber = Number(timestamp);
						const expirationTime =
							timestamp && !isNaN(timestampNumber)
								? dayjs(timestampNumber).add(1, 'days').valueOf()
								: undefined;
						const currentTime = dayjs().valueOf();

						if (expirationTime && currentTime > expirationTime) {
							Logger.warn(
								`CADENAS 3D CAD Download: EXCEEDS_RETRY_UPPER_LIMIT expired url=${url}`
							);
						} else {
							Logger.error(
								`CADENAS 3D CAD Download: EXCEEDS_RETRY_UPPER_LIMIT unknown error url=${url}`
							);
						}

						return;
					}

					if (retryCount > 0) {
						await timer.sleep(2500);
					}

					response = await getGenerationStatus({ url }, token);
					// if url is empty string, continue
					if (!!response.url) {
						break;
					}
				} catch (error) {
					if (
						error instanceof ApiCancelError ||
						error instanceof TimerCancelError
					) {
						throw error;
					}
					// ignore others
				}
				retryCount++;
			}

			return response;
		},
		[timer]
	);

	return { getCadenasFileUrl, cancel: timer.cancel };
};
