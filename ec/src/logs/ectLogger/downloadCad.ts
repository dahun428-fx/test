import { TFunction } from 'i18next';
import { addCadLog } from '@/api/services/addCadLog';
import { addLog } from '@/api/services/addLog';
import { checkPrice } from '@/api/services/checkPrice';
import { config } from '@/config';
import { Flag } from '@/models/api/Flag';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack';
import { assertNotNull } from '@/utils/assertions';
import { getDaysToShipText } from '@/utils/domain/price';
import { normalizeUrl, url } from '@/utils/url';

/**
 * Send logs
 * - log/add
 * - cadLog/add
 */

//  TODO: Consider to remove t parameter by checking price and getDaysToShipText on CadDownloadStatusBalloon.hooks.ts
export function sendCadLogs(
	item: Pick<
		CadDownloadStackItem,
		| 'dynamicCadModifiedCommon'
		| 'cadFilename'
		| 'cadType'
		| 'cadFormat'
		| 'cadSection'
		| 'partNumber'
	> | null,
	t: TFunction
) {
	assertNotNull(item);
	const {
		dynamicCadModifiedCommon: cadInfo,
		cadFilename,
		cadType,
		cadFormat,
		cadSection,
	} = item;

	addLog(LogType.DETAIL_TAB, {
		brandCode: cadInfo.BRD_CODE ?? '',
		seriesCode: cadInfo.SERIES_CODE,
		tabName: '17',
		url: normalizeUrl(window.location.href),
	});

	checkPrice({
		productList: [
			{ partNumber: item.partNumber, quantity: 1, brandCode: cadInfo.BRD_CODE },
		],
	})
		.then(({ priceList }) => {
			const price = priceList[0];

			// assertNotNull したいところですが、log 送信なので万が一のことを考えて return するようにしました。
			// (log 送信できなくてもアプリ全体は生かす)
			if (!price) {
				return;
			}

			// NOTE: 現行だと商品詳細画面でしか送れない項目あり。
			//       CADファイルの商品と別の商品ページが異なる場合に、商品ページの情報が送られてしまうため、
			//       問題ないか要確認。(log/add の方も送信データに不備あり)
			addCadLog({
				prjPath: cadInfo.prj,
				productId: cadInfo.SERIES_CODE || '',
				// TODO: Implement product type when handling CAD download in product detail page
				productType: cadInfo.PRODUCT_TYPE || '',
				productPageUrl:
					cadInfo.PAGE_PATH ||
					normalizeUrl(
						url.productDetail(cadInfo.SERIES_CODE).forCad(item.partNumber)
					),
				// NOTE: Remove parameter product image url
				// Ex: I: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001?$product_main$
				//     O: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001
				productImgUrl: (cadInfo.MAIN_PHOTO ?? '')
					.replace(/(\?.*?)\$[^$]+\$(&?)/, '$1')
					.replace(/[?&]+$/, ''),
				productName: cadInfo.SERIES_NAME,
				partNumber: price.partNumber ?? '',
				innerCd: price.innerCode ?? '',
				amount: price.quantity,
				unitPrice: price.unitPrice,
				catalogPrice: price.standardUnitPrice,
				totalPriceWithTaxes: price.totalPriceIncludingTax,
				stoke: price.expressType ?? '',
				pack: String(price.piecesPerPackage ?? ''),
				currencyCode: price.currencyCode ?? '',
				makerCd: price.brandCode || cadInfo.BRD_CODE,
				days: getDaysToShipText(t, price.daysToShip),
				makerName: cadInfo.BRD_NAME ?? '',
				campaignEndDate: '', // NOTE: Needs series info.
				siteId: config.applicationId.msm,
				cadFilename,
				cadType,
				cadFormat,
				cadSection,
			});
		})
		.catch(() => {
			// noop
		});
}

// WEB2CAD専用ログ送信function。WEB2CADは型番未確定状態でもCAD機能が使えてログも送信されるため、functionを別に用意
export function sendWeb2CadLogs(
	item: Pick<
		CadDownloadStackItem,
		| 'dynamicCadModifiedCommon'
		| 'cadFilename'
		| 'cadType'
		| 'cadFormat'
		| 'cadSection'
		| 'partNumber'
	> | null,
	t: TFunction,
	completeFlag: Flag
) {
	assertNotNull(item);
	const {
		dynamicCadModifiedCommon: cadInfo,
		cadFilename,
		cadType,
		cadFormat,
		cadSection,
		partNumber,
	} = item;

	// 型番確定時はプライス情報を取得してログ送信する。未確定時はプライス情報無しでログを送信する
	if (Flag.isTrue(completeFlag)) {
		checkPrice({
			productList: [
				{ partNumber: partNumber, quantity: 1, brandCode: cadInfo.BRD_CODE },
			],
		})
			.then(({ priceList }) => {
				const price = priceList[0];

				// assertNotNull したいところですが、log 送信なので万が一のことを考えて return するようにしました。
				// (log 送信できなくてもアプリ全体は生かす)
				if (!price) {
					return;
				}

				// NOTE: 現行だと商品詳細画面でしか送れない項目あり。
				//       CADファイルの商品と別の商品ページが異なる場合に、商品ページの情報が送られてしまうため、
				//       問題ないか要確認。(log/add の方も送信データに不備あり)
				addCadLog({
					prjPath: cadInfo.prj,
					productId: cadInfo.SERIES_CODE || '',
					// TODO: Implement product type when handling CAD download in product detail page
					productType: cadInfo.PRODUCT_TYPE || '',
					productPageUrl:
						cadInfo.PAGE_PATH ||
						normalizeUrl(
							url.productDetail(cadInfo.SERIES_CODE).forCad(item.partNumber)
						),
					// NOTE: Remove parameter product image url
					// Ex: I: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001?$product_main$
					//     O: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001
					productImgUrl: (cadInfo.MAIN_PHOTO ?? '')
						.replace(/(\?.*?)\$[^$]+\$(&?)/, '$1')
						.replace(/[?&]+$/, ''),
					productName: cadInfo.SERIES_NAME,
					partNumber: price.partNumber ?? '',
					innerCd: price.innerCode ?? '',
					amount: price.quantity,
					unitPrice: price.unitPrice,
					catalogPrice: price.standardUnitPrice,
					totalPriceWithTaxes: price.totalPriceIncludingTax,
					stoke: price.expressType ?? '',
					pack: String(price.piecesPerPackage ?? ''),
					currencyCode: price.currencyCode ?? '',
					makerCd: price.brandCode || cadInfo.BRD_CODE,
					days: getDaysToShipText(t, price.daysToShip),
					makerName: cadInfo.BRD_NAME ?? '',
					campaignEndDate: '', // NOTE: Needs series info.
					siteId: config.applicationId.msm,
					cadFilename,
					cadType,
					cadFormat,
					cadSection,
				});
			})
			.catch(() => {
				// noop
			});
	} else {
		addCadLog({
			prjPath: cadInfo.prj,
			productId: cadInfo.SERIES_CODE || '',
			// TODO: Implement product type when handling CAD download in product detail page
			productType: cadInfo.PRODUCT_TYPE || '',
			productPageUrl:
				cadInfo.PAGE_PATH ||
				normalizeUrl(
					url.productDetail(cadInfo.SERIES_CODE).forCad(item.partNumber)
				),
			// NOTE: Remove parameter product image url
			// Ex: I: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001?$product_main$
			//     O: //assets.misumi-ec.com/is/image/misumiPrd/110100092750_001
			productImgUrl: (cadInfo.MAIN_PHOTO ?? '')
				.replace(/(\?.*?)\$[^$]+\$(&?)/, '$1')
				.replace(/[?&]+$/, ''),
			productName: cadInfo.SERIES_NAME || '',
			partNumber: '',
			innerCd: '',
			amount: NaN,
			unitPrice: NaN,
			catalogPrice: NaN,
			totalPriceWithTaxes: NaN,
			stoke: '',
			pack: '',
			currencyCode: '',
			makerCd: cadInfo.BRD_CODE || '',
			days: '',
			makerName: cadInfo.BRD_NAME ?? '',
			campaignEndDate: '', // NOTE: Needs series info.
			siteId: config.applicationId.msm,
			cadFilename,
			cadType,
			cadFormat,
			cadSection,
		});
	}
}

export function sendCadGenerateLog({
	tabName,
	brandCode,
	seriesCode,
}: {
	tabName: '13' | '15';
	brandCode: string;
	seriesCode: string;
}) {
	addLog(LogType.DETAIL_TAB, {
		tabName: tabName,
		seriesCode: seriesCode,
		brandCode: brandCode,
		url: normalizeUrl(window.location.href),
	});
}

export function sendCadOpenLog({
	tabName,
	brandCode,
	seriesCode,
}: {
	tabName: '4f' | '4u';
	brandCode: string;
	seriesCode: string;
}) {
	addLog(LogType.DETAIL_TAB, {
		tabName: tabName,
		seriesCode: seriesCode,
		brandCode: brandCode,
		url: normalizeUrl(window.location.href),
	});
}

export function sendCadErrorLog(params: {
	partNumber: string;
	seriesCode: string;
	projectPath: string;
	errorType: string;
	mident?: string;
	partNumberCadenas?: string;
}) {
	const projectPathCadenas = params.mident?.match(/\/metric.*prj/) ?? [];
	const returnedValue = params.mident?.match(/prj\},(.*)/) ?? [];

	addLog(LogType.CADENAS, {
		errorType: params.errorType,
		partNumber: params.partNumber,
		partNumberCadenas: params.partNumberCadenas ?? '',
		projectPath: params.projectPath,
		projectPathCadenas: projectPathCadenas[projectPathCadenas.length - 1] ?? '',
		returnedValue: returnedValue[returnedValue.length - 1] ?? '',
		seriesCode: params.seriesCode,
	});
}
