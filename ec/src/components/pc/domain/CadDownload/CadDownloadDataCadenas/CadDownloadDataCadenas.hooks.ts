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
	updateItemOperation,
	updateShowsStatusOperation,
	updateTabDoneStatusOperation,
} from '@/store/modules/common/stack';
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
import {
	CadDownloadStackItem,
	CadDownloadStatus,
	SelectedCadDataFormat,
} from '@/models/localStorage/CadDownloadStack';
import { updateCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
import dayjs from 'dayjs';

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
	const [fixedCadOption, setFixedCadOption] =
		useState<SelectedCadDataFormat | null>(null);
	const dispatch = useDispatch();

	const cadenasParameterMap = cadData.dynamic3DCadList[0]?.parameterMap;

	const handleChangeFormat = useCallback(
		(option: SelectedOption, isFixed: boolean) => {
			setIsDisableGenerate(false);
			setSelectedOption(option);

			selectedFixedOption(option, isFixed);
		},
		[]
	);

	/**
	 * 자식 컴포넌트 ( CadenasFormatSelect ) 로부터 isFixed 에 대한 boolean 값을 받아,
	 * true라면, fixedCadOption 에 세팅하여 CadDownloadProgressArea 컴포넌트로 전달하여,
	 * @param option
	 * @param isFixed boolean. CadenasFormatSelect isFixedCadOption()
	 */
	const selectedFixedOption = (option: SelectedOption, isFixed: boolean) => {
		if (isFixed) {
			const formatListByValueOrFormat = getFormatListByValueOrFormat(
				cadData.fileTypeList
			);
			const versionOption = getVersionOptions(
				option?.format,
				formatListByValueOrFormat
			);
			const selected = getSelectedCadOption(option, versionOption);
			setFixedCadOption(selected);
		} else {
			setFixedCadOption(null);
		}
	};

	/**
	 * 상품 상세의 선택 형번 CAD 다운로드 모달 창에서 담기, 즉시다운로드 버튼 클릭 시
	 * 실행되는 함수.
	 * iframe 만들기 -> cad 정보 받기 : api get 통신 -> iframe onload -> store 및 localStorage items 변경
	 * @param selectedCad SelectedCadDataFormat : 다운로드 할 cad
	 * @param type putsth : 담기, direct : 즉시다운로드
	 */
	const generateCad = async (
		selectedCad: SelectedCadDataFormat,
		type: 'putsth' | 'direct'
	) => {
		if (!mident || !cadenasParameterMap) {
			return;
		}

		const idx = uuidv4();
		let selected = selectedCad;

		if (!selected) return;

		setCookie(
			Cookie.CAD_DATA_FORMAT,
			encodeURIComponent(JSON.stringify(selected))
		);

		const iframe = document.createElement('iframe');
		iframe.id = `pss_ifDownload${idx}arr`;
		iframe.src = '/';
		iframe.width = '0';
		iframe.height = '0';
		iframe.name = `pss_ifDownload${idx}arr`;
		//iframe on load 시 실행
		iframe.onload = function () {
			const iframeWindow = iframe.contentWindow;
			console.log('handleLoadGenerate iframe', iframeWindow);
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				console.log('handleLoadGenerate iframe path', path);
				if (path?.includes(url.cadenasDownloadCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const xmlfile = query.get('xmlfile');
					console.log('xmlfile', xmlfile);
					if (xmlfile) {
						if (type === 'putsth') {
							assertNotNull(dynamicCadParams?.[0]);
							//store 및 localStorage 최신화
							addItemOperation(dispatch)({
								url: xmlfile + '?_=' + Date.now(),
								from: window.location.href,
								// assertNotNull(cadenasParameterMap) した方が良い？
								time: cadenasParameterMap?.cadGenerationTime,
								selected,
								partNumber,
								progress: 0,
								status: type, // putsth or direct ==> direct의 경우 CAD 다운로드 모달창에 담길 경우 자동 다운로드
								created: Date.now(),
								dynamicCadModifiedCommon: dynamicCadParams[0].COMMON,
								fileName: getFileName(partNumber, selected),
								id: idx,
								label: getLabel(selected),
								cadSection: 'PT',
								cadFilename: '',
								cadFormat: getCadFormat(selected),
								cadType: (selected.grp || '2D').toUpperCase(),
								downloadUrl: '',
								seriesName: dynamicCadParams[0].COMMON.SERIES_NAME,
								seriesCode: dynamicCadParams[0].COMMON.SERIES_CODE,
								checkOnStack: true,
								expiry: dayjs().add(1, 'day').valueOf(),
							});
							//CAD 다운로드 모달창 open
							updateShowsStatusOperation(dispatch)(true);
							//CAD 다운로드 모달창 '다운로드 대기' 탭 open
							updateTabDoneStatusOperation(dispatch)(false);
							//CAD 다운로드 창에 등록 후, localstorage 및 store 에 있는 cad item check (checkOnStack) 를 해제한다.
							setTimeout(() => {
								updateCadDownloadStackItem({ id: idx, checkOnStack: false });
								updateItemOperation(dispatch)({ id: idx, checkOnStack: false });
							}, 500);
						}
					} else {
						setErrorState('unavailable-part-number-error');
					}
				}
			}
		};
		document.body.appendChild(iframe);

		//api 를 통해 받은 정보를 iframe에 추가
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
			target: iframe.name,
		});

		// 	aa.events.sendDownloadCadenas();
		// 	ga.events.downloadCad.cadenas();
	};

	/**
	 * 담기 버튼 클릭
	 */
	const handleStackPutsthAdd = useCallback(
		async (selectedCadDataList: SelectedCadDataFormat[]) => {
			if (selectedCadDataList.length > 0) {
				selectedCadDataList.forEach((element, index) => {
					generateCad(element, 'putsth');
				});
			}
		},
		[generateCad]
	);

	/**
	 * 즉시다운로드 버튼 클릭
	 */
	const handleDirectDownload = useCallback(
		async (selectedCadDataList: SelectedCadDataFormat[]) => {
			if (selectedCadDataList.length > 0) {
				selectedCadDataList.forEach((element, index) => {
					generateCad(element, 'direct');
				});
			}
		},
		[generateCad]
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
		handleLoadResolve,
		handleChangeFormat,
		handleStackPutsthAdd,
		handleDirectDownload,
		fixedCadOption,
	};
};
