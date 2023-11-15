import { Canceler } from 'axios';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { checkPrice } from '@/api/services/checkPrice';
import { downloadCad } from '@/api/services/downloadCad';
import { DownloadProductDetailResult } from '@/components/mobile/pages/ProductDetail/ProductDetailsDownloadModal/ProductDetailsDownloadContent';
import { ApplicationError } from '@/errors/ApplicationError';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	CheckPriceResponse,
	Price,
} from '@/models/api/msm/ect/price/CheckPriceResponse';
import {
	CadDownloadButtonType,
	SearchSeriesResponse$detail,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { CadSiteType } from '@/models/domain/cad';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { store } from '@/store';
import {
	refreshAuth,
	selectAuthenticated,
	selectUserPermissions,
} from '@/store/modules/auth';
import {
	selectCurrentPartNumberResponse,
	selectSeries,
	selectSimpleProductDetailsDownloadParameters,
} from '@/store/modules/pages/productDetail';
import { getMinOrderQuantity } from '@/utils/domain/price';
import { url } from '@/utils/url';

/**
 * Required params for download product details
 * NOTE: Params#partNumberInfo meet the following requirements.
 * - partNumberList.length === 1
 * - completeFlag === '1'
 */
type DownloadParams = {
	priceCheckInfo: CheckPriceResponse;
	seriesInfo: SearchSeriesResponse$detail;
	partNumberInfo: SearchPartNumberResponse$search;
	cadType?: string;
	cadVersion?: string;
	cadDownloadUrl?: string;
	cadErrorFlag?: Flag;
};

/** Payment method required modal hook */
export const useProductDetailsDownloadContent = (
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>,
	close?: (result?: DownloadProductDetailResult) => void
) => {
	const { t } = useTranslation();
	const { generateToken } = useApiCancellation();
	const series = useSelector(selectSeries);
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);

	const [loading, startLoading, endLoading] = useBoolState(false);
	const [cadData, setCadData] = useState<DownloadCadResponse>();
	const [priceCheckError, setPriceCheckError] = useState<string>();
	const priceRef = useRef<CheckPriceResponse>();
	const quantityAlertMessageRef = useRef<string>();
	const dispatch = useDispatch();

	const partNumber =
		currentPartNumberResponse?.partNumberList[0]?.partNumber ?? '';
	const completeFlag = currentPartNumberResponse?.completeFlag;

	const ableToDownloadCadData =
		series.cadDownloadButtonType === CadDownloadButtonType.ON;

	const downloadParameters = useSelector(
		selectSimpleProductDetailsDownloadParameters(partNumber)
	);

	const quantityAlert = useCallback(
		({ minQuantity = 1, orderUnit = 1 }: Price): string => {
			if (minQuantity > 1 && orderUnit > 1) {
				return t(
					'mobile.pages.productDetail.productDetailsDownloadModal.quantityAlertModal.bothFactorValidation',
					{ minQuantity, orderUnit }
				);
			}

			if (minQuantity > 1) {
				return t(
					'mobile.pages.productDetail.productDetailsDownloadModal.quantityAlertModal.minQuantityOnlyValidation',
					{ minQuantity }
				);
			}

			if (orderUnit > 1) {
				return t(
					'mobile.pages.productDetail.productDetailsDownloadModal.quantityAlertModal.orderUnitOnlyValidation',
					{ orderUnit }
				);
			}

			throw new ApplicationError(
				`MinQuantity=${minQuantity} OrderUnit=${orderUnit}`
			);
		},
		[t]
	);

	const downloadZip = useCallback(
		({
			priceResponse,
			cadDownloadUrl,
			cadErrorFlag,
			selectedCadDataFormat,
		}: {
			priceResponse: CheckPriceResponse;
			cadDownloadUrl?: string;
			selectedCadDataFormat?: SelectedCadDataFormat;
			cadErrorFlag?: Flag;
		}) => {
			const formId = 'product-details-download-form';

			const previousForm = document.getElementById(formId);
			if (previousForm) {
				try {
					document.removeChild(previousForm);
					// 稀にエラーになることがあるため握りつぶしています
				} catch {}
			}

			const form = document.createElement('form');
			form.id = formId;
			form.action = url.productDetailsDownloadZip(partNumber);
			form.method = 'POST';
			form.target = '_self';

			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'productInfoParam';
			const params: DownloadParams = {
				...downloadParameters,
				priceCheckInfo: priceResponse,
				cadDownloadUrl: cadDownloadUrl,
				cadErrorFlag,
				cadType:
					selectedCadDataFormat?.formatText ?? selectedCadDataFormat?.format,
				cadVersion:
					selectedCadDataFormat?.versionText ?? selectedCadDataFormat?.version,
			};
			input.value = JSON.stringify(params);
			form.appendChild(input);

			document.body.appendChild(form);
			form.submit();

			// Send AA log
			aa.events.sendDownloadProductDetails();
		},
		[downloadParameters, partNumber]
	);

	const shouldCorrectQuantity = (price: Price) => {
		const { minQuantity = 1, orderUnit = 1 } = price;
		return minQuantity > 1 || orderUnit > 1;
	};

	/**
	 * Get the product price and lead time.
	 * If the quantity does not meet the minimum order quantity or order unit,
	 * the quantity is corrected and the price is obtained again
	 */
	const getPrice = useCallback(async () => {
		try {
			const token = generateToken(c => {
				cancelerRefs.current?.push(c);
			});
			const response = await checkPrice(
				{
					productList: [
						{
							partNumber,
							quantity: 1,
							brandCode: series.brandCode,
						},
					],
				},
				token
			);

			if (response.priceList[0] === undefined) {
				return;
			}

			if (!shouldCorrectQuantity(response.priceList[0])) {
				return response;
			}

			const correctedResponse = await checkPrice(
				{
					productList: [
						{
							partNumber,
							quantity: getMinOrderQuantity(response.priceList[0]),
							brandCode: series.brandCode,
						},
					],
				},
				token
			);

			if (correctedResponse.priceList[0] === undefined) {
				return;
			}

			const quantityAlertMessage = quantityAlert(response.priceList[0]);

			if (quantityAlertMessage) {
				quantityAlertMessageRef.current = quantityAlertMessage;

				setPriceCheckError(quantityAlertMessage);
			}

			return correctedResponse;
		} catch (error) {
			close?.();
		}
	}, [
		cancelerRefs,
		close,
		generateToken,
		partNumber,
		quantityAlert,
		series.brandCode,
	]);

	const handleCadDownloadComplete = useCallback(
		(
			cadDownloadUrl?: string,
			selectedCadDataFormat?: SelectedCadDataFormat,
			cadErrorFlag?: Flag
		) => {
			if (priceRef.current) {
				downloadZip({
					priceResponse: priceRef.current,
					cadDownloadUrl,
					cadErrorFlag,
					selectedCadDataFormat,
				});
				close?.();
			}
		},
		[close, downloadZip]
	);

	const handleClearPriceCheckError = useCallback(() => {
		if (cadData?.cadSiteType !== CadSiteType.CADENAS && priceRef.current) {
			downloadZip({
				priceResponse: priceRef.current,
			});
			close?.();
			return;
		}

		setPriceCheckError(undefined);
		quantityAlertMessageRef.current = undefined;
	}, [cadData?.cadSiteType, close, downloadZip]);

	useOnMounted(async () => {
		startLoading();
		await refreshAuth(dispatch)();

		// logged in?
		if (!selectAuthenticated(store.getState())) {
			close?.({ type: 'UNAUTHENTICATED' });
			return;
		}

		// checking cad download permission
		const { hasCadDownloadPermission } = selectUserPermissions(
			store.getState()
		);

		try {
			const price = await getPrice();
			priceRef.current = price;

			if (!price) {
				return;
			}

			let hasCadData = false;

			if (ableToDownloadCadData && hasCadDownloadPermission) {
				const token = generateToken(c => {
					cancelerRefs.current?.push(c);
				});
				const cadData = await downloadCad(
					{
						seriesCode: series.seriesCode,
						partNumber,
						cadId: currentPartNumberResponse?.cadIdList?.join() ?? '',
					},
					token
				);
				setCadData(cadData);

				if (cadData.cadSiteType === CadSiteType.CADENAS) {
					hasCadData = true;
				}
			}

			if (quantityAlertMessageRef.current) {
				return;
			}

			if (!hasCadData) {
				downloadZip({
					priceResponse: price,
				});
				close?.();
			}
		} catch (error) {
			if (priceRef.current) {
				if (!(error instanceof ApiCancelError)) {
					downloadZip({
						priceResponse: priceRef.current,
						cadErrorFlag: '1',
					});
				}
				close?.();
			}
		} finally {
			// close loading modal
			endLoading();
		}
	});

	return {
		loading,
		cadData,
		priceCheckError,
		completeFlag,
		onCadDownloadCompleted: handleCadDownloadComplete,
		onClearPriceCheckError: handleClearPriceCheckError,
	};
};
