import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorType } from '@/components/pc/domain/CadDownload/types';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams, SelectedOption } from '@/models/domain/cad';
import { useSelector } from '@/store/hooks';
import { selectUserPermissions } from '@/store/modules/auth';
import {
	addItemOperation,
	updateShowsStatusOperation,
} from '@/store/modules/cadDownload';
import { assertNotNull } from '@/utils/assertions';
import {
	getCadFormat,
	getFileName,
	getFormatListByValueOrFormat,
	getLabel,
	getSelectedCadOption,
	getVersionOptions,
} from '@/utils/cad';
import { Cookie, setCookie } from '@/utils/cookie';
import { isSucceeded } from '@/utils/domain/cad/cadenas';
import { get } from '@/utils/get';
import { url } from '@/utils/url';
import { uuidv4 } from '@/utils/uuid';

const resolveIFrameName = 'cadenas-download-resolve-iframe';
const generateIFrameName = 'cadenas-download-generate-iframe';

/**
 * CAD download data cadenas hook
 */
export const useCadDownloadDataCadenas = ({
	cadData,
	brandCode,
	seriesCode,
	partNumber,
	completeFlag,
	dynamicCadParams,
	onResolving,
}: {
	cadData: DownloadCadResponse;
	brandCode: string;
	seriesCode: string;
	partNumber: string;
	dynamicCadParams: DynamicParams[] | null;
	completeFlag?: Flag;
	onResolving: (value: boolean) => void;
}) => {
	const userPermissions = useSelector(selectUserPermissions);

	const [loadingResolve, startToLoadResolve, endLoadingResolve] =
		useBoolState(true);
	const [errorState, setErrorState] = useState<ErrorType | null>(null);
	const [isDisableGenerate, setIsDisableGenerate] = useState(false);
	const [mident, setMident] = useState<string | null>(null);
	const resolveRef = useRef<HTMLIFrameElement>(null);
	const generateRef = useRef<HTMLIFrameElement>(null);
	const [selectedOption, setSelectedOption] = useState<SelectedOption>();
	const dispatch = useDispatch();

	const cadenasParameterMap = cadData.dynamic3DCadList[0]?.parameterMap;

	const handleChangeFormat = useCallback((option: SelectedOption) => {
		setIsDisableGenerate(false);
		setSelectedOption(option);
	}, []);

	const handleGenerateData = () => {
		if (!mident || !cadenasParameterMap) {
			return;
		}

		const formatListByValueOrFormat = getFormatListByValueOrFormat(
			cadData.fileTypeList
		);
		const versionOption = getVersionOptions(
			selectedOption?.format,
			formatListByValueOrFormat
		);
		const selected = getSelectedCadOption(selectedOption, versionOption);

		setCookie(
			Cookie.CAD_DATA_FORMAT,
			encodeURIComponent(JSON.stringify(selected))
		);

		ectLogger.cad.generate({ tabName: '15', brandCode, seriesCode });

		setIsDisableGenerate(true);

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

		aa.events.sendDownloadCadenas();
		ga.events.downloadCad.cadenas();
	};

	const startDownload = useCallback(
		(xmlFile: string) => {
			console.log(
				'startDownload ===> ',
				selectedOption?.format,
				dynamicCadParams?.[0]
			);
			assertNotNull(selectedOption?.format);
			assertNotNull(dynamicCadParams?.[0]);

			const selected = getSelectedCadOption(selectedOption, []);

			addItemOperation(dispatch)({
				url: xmlFile + '?_=' + Date.now(),
				from: window.location.href,
				// assertNotNull(cadenasParameterMap) した方が良い？
				time: cadenasParameterMap?.cadGenerationTime,
				selected,
				partNumber,
				progress: 0,
				status: 'pending',
				created: Date.now(),
				dynamicCadModifiedCommon: dynamicCadParams[0].COMMON,
				fileName: getFileName(partNumber, selected),
				id: uuidv4(),
				label: getLabel(selected),
				cadSection: 'PT',
				cadFilename: '',
				cadFormat: getCadFormat(selected),
				cadType: (selected.grp || '2D').toUpperCase(),
				downloadUrl: '',
			});

			updateShowsStatusOperation(dispatch)(true);
		},
		[
			cadenasParameterMap,
			dispatch,
			dynamicCadParams,
			partNumber,
			selectedOption,
		]
	);

	const handleLoadResolve = () => {
		console.log('handleLoadResolve');
		try {
			const iframeWindow = resolveRef.current?.contentWindow;
			console.log('iframeWindow', iframeWindow);
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				console.log('iframeWindow path', path);
				if (path?.includes(url.cadenasDownloadCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const mident = query.get('mident');
					const errorType = query.get('error_type');
					const vonaPartNumber = query.get('vona_pn');
					const resolvedPartNumber = query.get('resolved_pn');

					// NOTE: end loading here instead of inside finally block
					// When cannot resolve due to network issue, the loading wheel shows forever
					endLoadingResolve();
					if (mident && isSucceeded(query)) {
						console.log('set mident', mident);
						setMident(mident);
					} else {
						if (Flag.isTrue(completeFlag)) {
							ectLogger.cad.error({
								partNumber: vonaPartNumber ?? '',
								partNumberCadenas: resolvedPartNumber ?? '',
								seriesCode,
								projectPath: dynamicCadParams?.[0]?.COMMON.prj ?? '',
								mident: mident ?? '',
								errorType: errorType ?? '',
							});
						}
						setErrorState('unavailable-part-number-error');
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
		console.log('handleLoadGenerate');
		try {
			const iframeWindow = generateRef.current?.contentWindow;
			console.log('handleLoadGenerate iframe', iframeWindow);
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				console.log('handleLoadGenerate iframe path', path);
				if (path?.includes(url.cadenasDownloadCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const xmlfile = query.get('xmlfile');
					console.log('xmlfile', xmlfile);
					if (xmlfile) {
						startDownload(xmlfile);
					} else {
						setErrorState('unavailable-part-number-error');
					}
				}
			}
		} catch {
			// noop
			// - Error example:
			//   Uncaught DOMException: Blocked a frame with origin "https://xxx" from accessing a cross-origin frame.
		}
	}, [startDownload]);

	useEffect(() => {
		onResolving(loadingResolve);
	}, [loadingResolve, onResolving]);

	useOnMounted(() => {
		if (!cadenasParameterMap) {
			endLoadingResolve();
			return;
		}

		if (resolveRef.current && cadenasParameterMap) {
			const iframeWindow = resolveRef.current.contentWindow;
			if (iframeWindow && cadenasParameterMap.cadenasResolveUrl) {
				startToLoadResolve();
				get({
					url: url
						.cadenas({
							cadenasResolveUrl: cadenasParameterMap.cadenasResolveUrl,
							cadenasPloggerUrl: cadenasParameterMap.cadenasPloggerUrl ?? '',
						})
						.resolve(),
					query: {
						pn: partNumber,
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
			} else {
				// NOTE: resolve URL がない場合はエラー表示する
				setErrorState('unavailable-part-number-error');
				endLoadingResolve();
			}
		}
	});

	return {
		hasCADPermission: userPermissions.hasCadDownloadPermission,
		errorState,
		isDisableGenerate,
		loadingResolve,
		generateRef,
		resolveRef,
		resolveIFrameName,
		generateIFrameName,
		handleLoadGenerate,
		handleLoadResolve,
		handleGenerateData,
		handleChangeFormat,
	};
};
