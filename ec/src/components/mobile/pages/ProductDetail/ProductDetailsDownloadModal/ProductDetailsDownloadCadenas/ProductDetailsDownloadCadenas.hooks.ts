import { Canceler, CancelToken } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Error } from './ProductDetailsDownloadCadenasError';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { getGenerationStatus } from '@/api/services/cadenas/getGenerationStatus';
import { ApplicationError } from '@/errors/ApplicationError';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { CadenasApiError } from '@/errors/api/CadenasApiError';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { GetGenerationStatusResponse } from '@/models/api/cadenas/generationStatus/GetGenerationStatusResponse';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams, SelectedOption } from '@/models/domain/cad';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import {
	selectCurrentPartNumberResponse,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import {
	createParam,
	getCadFormat,
	getFormatListByValueOrFormat,
	getSelectedCadOption,
	getVersionOptions,
} from '@/utils/cad';
import { Cookie, setCookie } from '@/utils/cookie';
import { isSucceeded, MAX_CADENAS_RETRY } from '@/utils/domain/cad/cadenas';
import { get } from '@/utils/get';
import { post } from '@/utils/post';
import { sleep, useTimer } from '@/utils/timer';
import { url } from '@/utils/url';
import { uuidv4 } from '@/utils/uuid';
import { openSubWindow } from '@/utils/window';

export const resolveIFrameName = 'product-details-resolve-iframe';
export const generateIFrameName = 'product-details-generate-iframe';

/** Product details download sinus hook */
export const useProductDetailsDownloadCadenas = ({
	cadData,
	cancelerRefs,
	onCadDownloadCompleted,
}: {
	cadData: DownloadCadResponse;
	completeFlag?: Flag;
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>;
	onCadDownloadCompleted: (
		cadDownloadUrl?: string,
		selectedCadDataFormat?: SelectedCadDataFormat,
		cadErrorFlag?: Flag
	) => void;
}) => {
	const [selectedOption, setSelectedOption] = useState<SelectedOption>();
	const [mident, setMident] = useState<string | null>(null);
	const [loadingResolve, startToLoadResolve, endLoadingResolve] =
		useBoolState(true);
	const [loading, startToLoad, endLoading] = useBoolState(false);
	const resolveRef = useRef<HTMLIFrameElement>(null);
	const generateRef = useRef<HTMLIFrameElement>(null);

	const { generateToken } = useApiCancellation();
	const token = generateToken(c => {
		cancelerRefs.current?.push(c);
	});

	const { userCode } = useSelector(selectAuth);
	const { brandCode, brandName, seriesCode, seriesName } =
		useSelector(selectSeries);
	const seriesImage = useSelector(selectMainPhotoUrl);
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const moldExpressType = useSelector(selectMoldExpressType);

	const [error, setError] = useState<Error>();
	const { getCadenasFileUrl, cancel: cancelTimer } = useGetCadenasFileUrl();

	const cadenasParameterMap = cadData.dynamic3DCadList[0]?.parameterMap;
	const partNumber = currentPartNumberResponse?.partNumberList[0]?.partNumber;
	const formatListByValueOrFormat = getFormatListByValueOrFormat(
		cadData.fileTypeList
	);
	const versionOption = getVersionOptions(
		selectedOption?.format,
		formatListByValueOrFormat
	);
	const selected = getSelectedCadOption(selectedOption, versionOption);

	const cadDynamic: DynamicParams[] | null = useMemo(() => {
		if (!cadData || !partNumber || !userCode) {
			return null;
		}

		return cadData.dynamic3DCadList.map(item => {
			return createParam({
				parameterMap: item.parameterMap,
				partNumber,
				userCode,
				moldExpressType,
				brandCode,
				brandName,
				seriesCode,
				seriesName,
				seriesImage,
			});
		});
	}, [
		cadData,
		partNumber,
		userCode,
		moldExpressType,
		brandCode,
		brandName,
		seriesCode,
		seriesName,
		seriesImage,
	]);

	const downloadCadenas = useCallback(
		async (xmlFile: string) => {
			assertNotNull(cadDynamic);
			assertNotNull(partNumber);

			const url = xmlFile + '?_=' + Date.now();

			try {
				const data = await getCadenasFileUrl(url, token);
				onCadDownloadCompleted(data?.url, selected);
			} catch (error) {
				if (
					error instanceof ApplicationError &&
					error.message === 'EXCEEDS_RETRY_UPPER_LIMIT'
				) {
					setError('download-timeout-error');
				}

				if (
					error instanceof ApplicationError &&
					error.name === 'CadenasApiError'
				) {
					setError('cadenas-api-error');
				}
			} finally {
				endLoading();
			}
		},
		[
			cadDynamic,
			endLoading,
			getCadenasFileUrl,
			onCadDownloadCompleted,
			partNumber,
			selected,
			token,
		]
	);

	const handleDownloadCad = async () => {
		if (error) {
			onCadDownloadCompleted(undefined, selected, Flag.TRUE);
			return;
		}

		if (!mident || loading) {
			return;
		}

		startToLoad();

		setCookie(
			Cookie.CAD_DATA_FORMAT,
			encodeURIComponent(JSON.stringify(selected))
		);

		await sleep(2500);

		if (!resolveRef.current || !cadenasParameterMap) {
			return;
		}

		get({
			url: cadenasParameterMap.cadenasCgi2PviewUrl,
			query: {
				cgiaction: cadenasParameterMap.cgiaction,
				downloadflags: cadenasParameterMap.downloadflags,
				firm: 'misumi',
				language: cadenasParameterMap.language,
				format: getCadFormat(selected),
				part: mident,
				ok_url: url.cadenasDownloadCallback + '?xmlfile=<%download_xml%>',
				dxfsettings: cadenasParameterMap.dxfsettings,
				CombinationView: cadenasParameterMap.CombinationView,
			},
			target: generateIFrameName,
		});
	};

	const handleLoadResolve = () => {
		try {
			const iframeWindow = resolveRef.current?.contentWindow;
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				if (path?.includes(url.cadenasDownloadCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const mident = query.get('mident');
					// NOTE: end loading here instead of inside finally block
					// When cannot resolve due to network issue, the loading wheel shows forever
					endLoadingResolve();
					if (mident && isSucceeded(query)) {
						setMident(mident);
					} else {
						setError('no-mident-error');
					}
				}
			}
		} catch {
			// noop
			// - Error example:
			//   Uncaught DOMException: Blocked a frame with origin "https://xxx" from accessing a cross-origin frame.
		}
	};

	const handleLoadGenerate = useCallback(() => {
		try {
			const iframeWindow = generateRef.current?.contentWindow;
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				if (path?.includes(url.cadenasDownloadCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const xmlfile = query.get('xmlfile');
					if (xmlfile) {
						downloadCadenas(xmlfile);
					}
				}
			}
		} catch {
			setError('not-resolve-error');
			// noop
			// - Error example:
			//   Uncaught DOMException: Blocked a frame with origin "https://xxx" from accessing a cross-origin frame.
		}
	}, [downloadCadenas]);

	const handleClickCadConfigure = (event: React.MouseEvent) => {
		event.preventDefault();

		if (!cadDynamic?.[0]) {
			return;
		}

		const target = `config${uuidv4()}`;

		openSubWindow('', target, { width: 1000, height: 650 });
		post({
			url: cadDynamic[0].urlInfo.assResolveURL,
			query: cadDynamic[0].psConfVonaParam,
			target,
		});
	};

	const handleSelect = useCallback((option: SelectedOption) => {
		setSelectedOption(option);
	}, []);

	useOnMounted(() => {
		if (!cadenasParameterMap) {
			endLoadingResolve();
			return;
		}

		if (resolveRef.current && cadenasParameterMap) {
			const iframeWindow = resolveRef.current.contentWindow;
			if (iframeWindow) {
				startToLoadResolve();
				get({
					url: url
						.cadenas({
							cadenasResolveUrl: cadenasParameterMap.cadenasResolveUrl,
							cadenasPloggerUrl: cadenasParameterMap.cadenasPloggerUrl ?? '',
						})
						.resolve(),
					query: {
						pn: partNumber ?? '',
						ec_loc: cadenasParameterMap.ec_loc,
						gc_wos: cadenasParameterMap.gc_wos,
						ge_sdm: cadenasParameterMap.ge_sdm,
						language: cadenasParameterMap.language,
						location: cadenasParameterMap.location,
						ge_location: cadenasParameterMap.ge_location,
						prj: cadenasParameterMap.prj,
						url: url.cadenasDownloadCallback,
					},
					target: resolveIFrameName,
				});
			}
		}
	});

	useEffect(() => {
		return () => cancelTimer();
	}, [cancelTimer]);

	return {
		resolveRef,
		generateRef,
		loading,
		error,
		loadingResolve,
		handleSelect,
		handleDownloadCad,
		handleLoadResolve,
		handleLoadGenerate,
		handleClickCadConfigure,
	};
};

/** Get CADENAS zip file URL */
const useGetCadenasFileUrl = () => {
	const timer = useTimer();

	const getCadenasFileUrl = useCallback(
		async (
			url: string,
			token: CancelToken
		): Promise<GetGenerationStatusResponse> => {
			let retryCount = 0;
			let response: GetGenerationStatusResponse | undefined;

			// polling
			while (true) {
				try {
					if (retryCount >= MAX_CADENAS_RETRY) {
						// このためだけに独自エラークラスを作るのは気が引けるが…
						throw new ApplicationError('EXCEEDS_RETRY_UPPER_LIMIT');
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
						error instanceof TimerCancelError ||
						error instanceof CadenasApiError ||
						(error instanceof ApplicationError &&
							error.message === 'EXCEEDS_RETRY_UPPER_LIMIT')
					) {
						throw error;
					}
					// ignore others
				}
				retryCount++;
			}

			assertNotNull(response);
			return response;
		},
		[timer]
	);

	return { getCadenasFileUrl, cancel: timer.cancel };
};
