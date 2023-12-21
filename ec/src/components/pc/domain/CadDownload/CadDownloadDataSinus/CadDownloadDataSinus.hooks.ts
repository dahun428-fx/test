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
import { DynamicParams } from '@/models/domain/cad';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
	SelectedCadDataFormat,
} from '@/models/localStorage/CadDownloadStack_origin';
import { selectAuth, selectUserPermissions } from '@/store/modules/auth';
import {
	addItemOperation,
	selectCadDownloadErrors,
	updateShowsStatusOperation,
} from '@/store/modules/cadDownload';
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

type GenerateCadPayload = {
	parameterMap: ParameterMap;
	dynamicCadModified: DynamicParams[] | null;
};

export const useCadDownloadDataSinus = (
	cadData: DownloadCadResponse,
	brandCode: string,
	seriesCode: string
) => {
	const [selectedCadOption, setSelectedCadOption] = useState<Option | null>(
		null
	);
	const [isDisableGenerate, setIsDisableGenerate] = useState(false);
	const userPermissions = useSelector(selectUserPermissions);
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const { customerCode } = useSelector(selectAuth);
	const errors = useSelector(selectCadDownloadErrors);
	const dispatch = useDispatch();

	const selected = useMemo(() => {
		return getSelectedCadDataFormat(selectedCadOption);
	}, [selectedCadOption]);

	const handleSelect = (option: Option) => {
		setIsDisableGenerate(false);
		setSelectedCadOption({
			group: option.group,
			label: option.label,
			value: option.value,
		});
	};

	const cadOptions = useMemo(() => {
		const data: Option[] = getFormatOptionsFromFileTypes(cadData.fileTypeList);
		return data;
	}, [cadData.fileTypeList]);

	const groups = useMemo(() => {
		return cadData.fileTypeList.map(list => list.type);
	}, [cadData.fileTypeList]);

	const generateCadItem = useCallback(
		({ parameterMap, dynamicCadModified }: GenerateCadPayload) => {
			if (
				!dynamicCadModified?.[0] ||
				!selectedCadOption ||
				!currentPartNumberResponse?.partNumberList[0]
			) {
				return;
			}

			setCookie(
				Cookie.CAD_DATA_FORMAT,
				encodeURIComponent(JSON.stringify(selected))
			);

			ectLogger.cad.generate({
				tabName: '13',
				seriesCode,
				brandCode,
			});

			aa.events.sendDownloadSinus();
			ga.events.downloadCad.sinus();

			setIsDisableGenerate(true);

			const requestData: DownloadCadRequest = {
				partNumberList: [
					{
						customer_cd: customerCode ?? undefined,
						language: parameterMap.language,
						partNumber: dynamicCadModified[0].COMMON.pn,
						seriesCode: dynamicCadModified[0].COMMON.SERIES_CODE,
						brdCode: dynamicCadModified[0].COMMON.BRD_CODE,
						typeCode:
							currentPartNumberResponse.partNumberList[0].typeCode ?? '',
						SYCD: currentPartNumberResponse.partNumberList[0].productCode,
						domain: parameterMap.domain,
						environment: parameterMap.environment,
						dl_format: selected.format ?? '',
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
				1000 /* ms */ *
					60 /* sec */ *
					60 /* min */ *
					24 /* hr */ *
					30; /* day */

			const stackItem: CadDownloadStackItem = {
				url: new Date().getTime().toString(),
				from: location.href,
				selected,
				partNumber: dynamicCadModified[0]?.COMMON.pn ?? '',
				dynamicCadModifiedCommon: dynamicCadModified[0]?.COMMON,
				requestData,
				type: 'sinus',
				expiry,
				id: uuidv4(),
				label: getLabel(selected),
				fileName: getFileName(dynamicCadModified[0]?.COMMON.pn, selected),
				progress: 0,
				created: +new Date(),
				status: CadDownloadStatus.Pending, // pending, checking, done, error
				cadSection: 'PCAD',
				cadFilename: '',
				cadFormat: selected.format ?? '',
				cadType: (selected.grp || '2D').toUpperCase(),
				downloadUrl: '',
			};

			addItemOperation(dispatch)(stackItem);
			updateShowsStatusOperation(dispatch)(true);
		},
		[
			brandCode,
			currentPartNumberResponse,
			customerCode,
			dispatch,
			selected,
			selectedCadOption,
			seriesCode,
		]
	);

	useOnMounted(() => {
		const cadDataFormatCookie = getCookie(Cookie.CAD_DATA_FORMAT);
		let cadDataFormat: SelectedCadDataFormat | undefined;

		if (cadDataFormatCookie) {
			try {
				cadDataFormat = JSON.parse(decodeURIComponent(cadDataFormatCookie));
			} catch (error) {}
		}

		const format = getDefaultFormat(cadData, cadDataFormat);
		setSelectedCadOption(format);
	});

	return {
		groups,
		cadOptions,
		hasCadDownloadPermission: userPermissions.hasCadDownloadPermission,
		isDisableGenerate,
		selected,
		errors,
		onSelectOption: handleSelect,
		generateCadItem,
	};
};
