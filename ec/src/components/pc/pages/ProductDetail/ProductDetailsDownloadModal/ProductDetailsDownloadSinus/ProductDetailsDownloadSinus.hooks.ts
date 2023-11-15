import { Canceler } from 'axios';
import { useMemo, useState } from 'react';
import { Error } from './ProductDetailsDownloadSinusError';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { downloadCad } from '@/api/services/sinus/downloadCad';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DownloadCadRequest } from '@/models/api/sinus/cad/DownloadCadRequest';
import { DynamicParams } from '@/models/domain/cad';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import {
	selectCurrentPartNumberResponse,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import {
	createParam,
	getDefaultFormat,
	getFormatOptionsFromFileTypes,
	getSelectedCadDataFormat,
} from '@/utils/cad';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';
import {
	getAlterationSpecList,
	getSpecValueList,
	isSinusBrowser,
} from '@/utils/domain/cad/sinus';
import { notEmpty } from '@/utils/predicate';

/** Product details download sinus hook */
export const useProductDetailsDownloadSinus = (
	cadData: DownloadCadResponse,
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>,
	onCadDownloadCompleted: (
		cadDownloadUrl?: string,
		selectedCadDataFormat?: SelectedCadDataFormat
	) => void
) => {
	const [selectedCadOption, setSelectedCadOption] = useState<Option | null>(
		null
	);

	const { generateToken } = useApiCancellation();
	const token = generateToken(c => {
		cancelerRefs.current?.push(c);
	});

	const { customerCode, userCode } = useSelector(selectAuth);
	const { brandCode, brandName, seriesCode, seriesName } =
		useSelector(selectSeries);
	const seriesImage = useSelector(selectMainPhotoUrl);
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const moldExpressType = useSelector(selectMoldExpressType);

	const [loading, startToLoad, endLoading] = useBoolState(false);
	const [error, setError] = useState<Error>();

	const partNumber = currentPartNumberResponse?.partNumberList[0]?.partNumber;

	const selected: SelectedCadDataFormat = useMemo(() => {
		return getSelectedCadDataFormat(selectedCadOption);
	}, [selectedCadOption]);

	const groups = useMemo(() => {
		return cadData?.fileTypeList.map(list => list.type);
	}, [cadData?.fileTypeList]);

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

	const generateDownloadCad = async () => {
		if (error) {
			onCadDownloadCompleted(undefined, selected);
			return;
		}

		const { dynamic3DCadList } = cadData;
		const parameterMap = dynamic3DCadList[0]?.parameterMap;

		// Disable download zip file when cad data is being downloaded
		if (
			!cadDynamic?.[0] ||
			!currentPartNumberResponse?.partNumberList[0] ||
			!parameterMap ||
			loading
		) {
			return;
		}

		startToLoad();

		try {
			const requestData: DownloadCadRequest = {
				partNumberList: [
					{
						customer_cd: customerCode ?? undefined,
						language: parameterMap.language,
						partNumber: cadDynamic[0].COMMON.pn,
						seriesCode: cadDynamic[0].COMMON.SERIES_CODE,
						brdCode: cadDynamic[0].COMMON.BRD_CODE,
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

			setCookie(
				Cookie.CAD_DATA_FORMAT,
				encodeURIComponent(JSON.stringify(selected))
			);

			const response = await downloadCad(requestData, token);

			if (response.status === '201' && notEmpty(response.path)) {
				onCadDownloadCompleted(response.path, selected);
			} else {
				setError('generate-error');
			}
		} catch (error) {
			if (error instanceof ApiCancelError) {
				return;
			}
			setError('generate-error');
		} finally {
			endLoading();
		}
	};

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

		if (!isSinusBrowser()) {
			setError('browser-error');
			return;
		}

		if (!cadData.fileTypeList.length) {
			setError('not-resolve-error');
		}
	});

	return {
		formatInfo: {
			groups,
			cadOptions: cadData
				? getFormatOptionsFromFileTypes(cadData.fileTypeList)
				: [],
		},
		selected,
		loading,
		error,
		setSelectedCadOption,
		generateDownloadCad,
	};
};
