import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import {
	DownloadCadResponse,
	ParameterMap,
} from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DownloadCadRequest } from '@/models/api/sinus/cad/DownloadCadRequest';
import { DynamicParams, SelectedOption } from '@/models/domain/cad';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
	SelectedCadDataFormat,
} from '@/models/localStorage/CadDownloadStack';
import { selectAuth, selectUserPermissions } from '@/store/modules/auth';
import {
	addItemOperation,
	selectCadDownloadErrors,
	updateItemOperation,
	updateShowsStatusOperation,
	updateTabDoneStatusOperation,
} from '@/store/modules/common/stack';
import { selectCurrentPartNumberResponse } from '@/store/modules/pages/productDetail';
import {
	getFileName,
	getLabel,
	getDefaultFormat,
	getFormatOptionsFromFileTypes,
	getSelectedCadDataFormat,
} from '@/utils/cad';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';
import {
	getAlterationSpecList,
	getSpecValueList,
} from '@/utils/domain/cad/sinus';
import { uuidv4 } from '@/utils/uuid';
import { updateCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';

type GenerateCadPayload = {
	parameterMap: ParameterMap;
	dynamicCadModified: DynamicParams[] | null;
};

export const useCadDownloadDataSinus = (
	cadData: DownloadCadResponse,
	cadDynamic: DynamicParams[] | null,
	brandCode: string,
	seriesCode: string
) => {
	const [fixedCadOption, setFixedCadOption] =
		useState<SelectedCadDataFormat | null>(null);

	const userPermissions = useSelector(selectUserPermissions);
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const { customerCode } = useSelector(selectAuth);
	const errors = useSelector(selectCadDownloadErrors);
	const dispatch = useDispatch();

	const parameterMap = cadData.dynamic3DCadList[0]?.parameterMap;
	const dynamicCadModified = cadDynamic;

	//useCallback의 인자를 [] 으로 한번만 함수 호출
	const handleSelect = useCallback(
		(option: SelectedOption, isFixed: boolean) => {
			console.log('handle select ===> ', isFixed);
			selectedFixedOption(
				{
					group: option.format.group,
					label: option.format.label,
					value: option.format.value,
				},
				isFixed
			);
		},
		[]
	);

	const selectedFixedOption = (option: Option, isFixed: boolean) => {
		if (isFixed) {
			const selected = getSelectedCadDataFormat(option);
			setFixedCadOption(selected);
		} else {
			setFixedCadOption(null);
		}
	};

	const generateCad = async (
		selectedCad: SelectedCadDataFormat,
		type: 'putsth' | 'direct'
	) => {
		if (
			!dynamicCadModified?.[0] ||
			!selectedCad ||
			!currentPartNumberResponse?.partNumberList[0] ||
			!parameterMap
		) {
			return;
		}

		let selected = selectedCad;

		setCookie(
			Cookie.CAD_DATA_FORMAT,
			encodeURIComponent(JSON.stringify(selected))
		);

		ectLogger.cad.generate({
			tabName: '13',
			seriesCode,
			brandCode,
		});

		console.log(
			'genearte Cad ===> ',
			selectedCad,
			type,
			parameterMap,
			dynamicCadModified
		);

		// 		aa.events.sendDownloadSinus();
		// 		ga.events.downloadCad.sinus();

		const requestData: DownloadCadRequest = {
			partNumberList: [
				{
					customer_cd: customerCode ?? undefined,
					language: parameterMap.language,
					partNumber: dynamicCadModified[0].COMMON.pn,
					seriesCode: dynamicCadModified[0].COMMON.SERIES_CODE,
					brdCode: dynamicCadModified[0].COMMON.BRD_CODE,
					typeCode: currentPartNumberResponse.partNumberList[0].typeCode ?? '',
					SYCD: currentPartNumberResponse.partNumberList[0].productCode,
					domain: parameterMap.domain,
					environment: parameterMap.environment,
					dl_format: selectedCad.format ?? '',
					specValueList: getSpecValueList({
						specList: currentPartNumberResponse.specList,
						partNumber: currentPartNumberResponse.partNumberList[0],
					}),
					alterationSpecList: getAlterationSpecList({
						alterationSpecList: currentPartNumberResponse.alterationSpecList,
					}),
				},
			],
		};

		const expiry =
			new Date().getTime() +
			1000 /* ms */ * 60 /* sec */ * 60 /* min */ * 24 /* hr */ * 30; /* day */

		const idx = uuidv4();

		const stackItem: CadDownloadStackItem = {
			url: new Date().getTime().toString(),
			from: location.href,
			selected,
			partNumber: dynamicCadModified[0]?.COMMON.pn ?? '',
			dynamicCadModifiedCommon: dynamicCadModified[0]?.COMMON,
			requestData,
			type: 'sinus',
			expiry,
			id: idx,
			label: getLabel(selected),
			fileName: getFileName(dynamicCadModified[0]?.COMMON.pn, selected),
			progress: 0,
			created: +new Date(),
			status: type,
			cadSection: 'PCAD',
			cadFilename: '',
			cadFormat: selected.format ?? '',
			cadType: (selected.grp || '2D').toUpperCase(),
			downloadUrl: '',
			seriesName: dynamicCadModified[0].COMMON.SERIES_NAME,
			seriesCode: dynamicCadModified[0].COMMON.SERIES_CODE,
			checkOnStack: true,
		};

		addItemOperation(dispatch)(stackItem);
		//CAD 다운로드 모달창 open
		updateShowsStatusOperation(dispatch)(true);
		//CAD 다운로드 모달창 '다운로드 대기' 탭 open
		updateTabDoneStatusOperation(dispatch)(false);
		setTimeout(() => {
			updateCadDownloadStackItem({ id: idx, checkOnStack: false });
			updateItemOperation(dispatch)({ id: idx, checkOnStack: false });
		}, 500);
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

	return {
		// groups,
		// cadOptions,
		fixedCadOption,
		hasCadDownloadPermission: userPermissions.hasCadDownloadPermission,
		// selected,
		errors,
		onSelectOption: handleSelect,
		handleStackPutsthAdd,
		handleDirectDownload,
		// generateCadItem,
	};
};
