//=============================================================================
// このファイルでは関数に名詞のような名付けを意図的にしていますが、他では真似しないでください。
//=============================================================================
import { resolveHref } from 'next/dist/shared/lib/router/router';
import Router from 'next/router';
import { UrlObject } from 'url';
import { config } from '@/config';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/constants/CadType';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { CadenasParameters } from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';
import { Query as CadPreviewQuery } from '@/models/pages/cadPreview';
import type { SharedQuery as CategoryQuery } from '@/pages/vona2/[...categoryCode].types';
import type { SharedQuery as MakerCategoryQuery } from '@/pages/vona2/maker/[brandCode]/[...categoryCode].types';
import { pagesPath } from '@/utils/$path';
import { assertNotEmpty } from '@/utils/assertions';
import { convertTypeToParam } from '@/utils/cad';
import { padZero } from '@/utils/string';

/**
 * WOS 言語コード候補
 * - 現法によって異なります。
 */
type WosLanguageCode = 'en';

/** CADENAS callback path */
const cadenasCallbackPath = '/vona2/3dpreview/cadenas.html';
/** CADENAS download callback path */
const cadenasDownloadCallbackPath = '/vona2/cad-download/cadenas.html';

/** No image path */
const noImagePath = '/vona2/assets/images/no-image.png';

// FIXME: It may be better to use trimUrlDomain method and adding query behind instead of adding protocol to URL.
// But almost CRM response having // on url so it is temporary OK.
type ToUrlOptions = {
	addProtocol?: boolean;
};
/**
 * Return URL with Added GET parameters
 * @param url - URL
 * @param query - GET parameters to add
 * @returns URL with added GET parameters
 */
export function toUrl(
	url: string,
	query?: Record<string, string>,
	options?: ToUrlOptions
) {
	if (options?.addProtocol && url.startsWith('//')) {
		url = `https:${url}`;
	}

	if (!query) {
		return url;
	}

	const parsedUrl = new URL(url);
	Object.entries(query).forEach(entry =>
		parsedUrl.searchParams.append(...entry)
	);
	return parsedUrl.toString();
}

/**
 * Converts a query object or 2D array to a query string.
 * @param query - query object
 * @returns query string
 */
function toQueryString(query: Record<string, string> | string[][]) {
	return new URLSearchParams(query).toString();
}

/** WOS login URL */
const wosLogin = `${config.web.wos.baseUrl}/common/EC002SingleLoginCmd.do`;

/**
 * URL utils
 * - NOTE: 外部 URL はドメイン付きで指定する必要がある可能性があります。deploy 後 要確認。
 */
export const url = {
	/** 도면가공센터 */
	faMdrs: 'https://fa-mdrs.misumi.co.kr',
	/** 배송조회 */
	deliveryCheck:
		'https://www.misumi.co.kr/sub.php?menu=delivery/&amp;clkid=clkid_kr_my_20160202_88',
	/** 배송방식 변경 */
	shippingWayChange:
		'https://www.misumi.co.kr/shippingwaychange/?clkid=clkid_kr_my_20160202_89',
	/** Brand list */
	brandList: convertToURLString(pagesPath.vona2.maker.$url()),
	/** Brand list category MISUMI */
	brandCategoryMisumi: convertToURLString(
		pagesPath.vona2.maker._brandCode('misumi').$url()
	),
	/** inCAD Library */
	inCadLibrary: `${config.web.ec.origin}/asia/incadlibrary/`,
	/** User's guide */
	guide: `${config.web.ec.origin}/guide/`,
	/** FAQ */
	faq: `${config.web.ec.origin}/guide/faq/`,
	/** Forms to contact us */
	contact: `${config.web.ec.origin}/asia/Contact.html`,
	/** News */
	news: `${config.web.ec.origin}/news/topics/`,
	/** Contact us */
	contactUs: `${config.web.ec.origin}/contents/contact/`,
	/** New customer registration guide */
	registrationGuide: `${config.web.ec.origin}/contents/regist/`,
	/** Cancellation Policy */
	cancelPolicy: `${config.web.ec.origin}/contents/cancelpolicy/`,
	/** Privacy Policy */
	privacyPolicy: `${config.web.ec.origin}/contents/privacy/`,
	/** Company Profile */
	companyProfile: `${config.web.ec.origin}/contents/company/`,
	/** Career */
	career: `${config.web.ec.origin}/contents/recruit/`,
	/** RoHS */
	rohs: `${config.web.ec.origin}/contents/environment/rohs/`,
	/** Terms of Use */
	terms: `${config.web.ec.origin}/contents/terms/`,
	/** Sitemap */
	// TODO: Remove this config when mobile footer link sitemap convert to used pagePaths
	sitemap: `${config.web.ec.origin}/vona2/sitemap/`,
	/** 미스미 브랜드 */
	makerTop: `${config.web.ec.origin}/maker/`,
	/** RAPiD Design */
	rapidDesign: `${config.web.ec.origin}/service/rd/`,
	/** 기술 정보 */
	techInfo: `${config.web.ec.origin}/tech-info/`,
	/** 미스미 베스트 2023 */
	misumiBest2023: `${config.web.ec.origin}/pr/vona/MISUMI_BEST_2023/`,
	/** Misumi CAD Download */
	misumiCad: `${config.web.ec.origin}/maker/misumi/cad/`,
	/** Musumi Technical Data */
	misumiTechnicalData: `${config.web.ec.origin}/maker/misumi/tech/`,
	/** Country/Region and Language */
	misumiRegion: `${config.web.ec.origin}/worldwide/`,
	cadGuide: `${config.web.ec.origin}/contents/guide/category/ecatalog/use_cad.html#config_02`,
	/**
	 * Code of Conduct
	 * - 本番サーバしかないようなのでドメイン付きで指定していますが、原則としてドメインは config から取得してください。
	 */
	codeOfConduct:
		'https://www.misumi.co.jp/english/esg/governance/compliance.html',
	/**
	 * IR Library
	 * - 本番サーバしかないようなのでドメイン付きで指定していますが、原則としてドメインは config から取得してください。
	 */
	irLibrary: 'https://www.misumi.co.jp/english/ir/',
	/**
	 * MISUMI Group Inc.
	 * - 本番サーバしかないようなのでドメイン付きで指定していますが、原則としてドメインは config から取得してください。
	 */
	misumiGroup: 'https://www.misumi.co.jp/english/',
	/** Facebook */
	facebook: 'https://www.facebook.com/misumisea',
	/** Cart */
	cart: `${config.web.ec.origin}/mypage/cart/`,
	/** Express Delivery Service */
	expressDeliveryService: `${config.web.ec.origin}/guide/category/ecatalog/st.html`,
	/** Stork Guide */
	storkGuide: `${config.web.ec.origin}/guide/category/ecatalog/st.html`,
	/** Slide Discount Guide */
	slideDiscountGuide: `${config.web.ec.origin}/guide/category/ecatalog/figure.html`,
	/** Same day shipping Guide */
	sameDayShippingGuide: `${config.web.ec.origin}/guide/category/ecatalog/shipping.html`,
	/** Direct order path */
	directOrder: `${config.web.ec.origin}/mypage/direct_order.html`,
	/** Direct checkout path */
	directCheckout: `${config.web.ec.origin}/mypage/direct_checkout.html`,
	/** Same day service */
	sameDayService: `${config.web.ec.origin}/service/sameday`,
	/** Direct quotation path */
	directQuotation: `${config.web.ec.origin}/mypage/direct_estimate.html`,
	/** CADENAS callback Path */
	cadenasCallbackPath,
	/** CADENAS download callback Path */
	cadenasDownloadCallbackPath,
	/** CADENAS callback URL */
	cadenasCallback: `${
		process.env.NEXT_PUBLIC_CAD_PREVIEW_ORIGIN ?? config.web.ec.origin
	}${cadenasCallbackPath}`,
	/** CADENAS download callback URL */
	cadenasDownloadCallback: `${
		process.env.NEXT_PUBLIC_CAD_PREVIEW_ORIGIN ?? config.web.ec.origin
	}${cadenasDownloadCallbackPath}`,
	/** SINUS(WEBMEX) Guide */
	sinusGuide: `${config.web.ec.origin}/guide/category/ecatalog/use_cad.html#webmex`,
	cadFormatGuide: `${config.web.ec.origin}/guide/category/ecatalog/file.html`,
	/** No image Path */
	noImagePath,
	// TODO: This will be removed and change to pagesPath when search result page is released.
	/** Search result page */
	searchResult: (keyword: string) => {
		const baseUrl = `${config.web.ec.origin}/vona2/result/`;
		return {
			withIsReSearch: (isReSearch: boolean) => {
				return `${baseUrl}?${toQueryString({
					Keyword: keyword,
					isReSearch: isReSearch ? Flag.TRUE : Flag.FALSE,
				})}`;
			},
		};
	},

	/** Product detail page from search results */
	productDetail: (seriesCode: string) => {
		const baseUrl = pagesPath.vona2.detail._seriesCode(seriesCode);
		return {
			default: convertToURLString(baseUrl.$url()),
			/** キーワード検索結果画面からの遷移 */
			fromKeywordSearch: (keyword: string) => {
				return {
					/** キーワード検索結果画面のタイプ検索結果からの遷移 */
					typeList(partNumber: string, cadType?: CadType, hasList = true) {
						const CAD = cadType && convertTypeToParam(cadType);
						const query: Record<string, string> = {
							HissuCode: partNumber,
							PNSearch: partNumber,
							KWSearch: keyword,
							searchFlow: 'results2type',
						};

						if (CAD) {
							query['CAD'] = CAD;
						}

						if (hasList) {
							query['list'] = ItemListName.KEYWORD_SEARCH_RESULT;
						}

						return convertToURLString(
							baseUrl.$url({
								query,
							})
						);
					},
					/** キーワード検索結果画面のシリーズ検索結果からの遷移 */
					seriesList(cadType?: CadType, list?: string) {
						const query: Record<string, string | undefined> = {
							KWSearch: keyword,
							searchFlow: 'results2products',
						};

						if (list) {
							query['list'] = list;
						}

						const CAD = cadType && convertTypeToParam(cadType);

						if (CAD) {
							query['CAD'] = CAD;
						}

						return convertToURLString(baseUrl.$url({ query }));
					},
					comboLink(partNumber: string) {
						return convertToURLString(
							baseUrl.$url({
								query: {
									HissuCode: partNumber,
									searchFlow: 'results2similartn',
								},
							})
						);
					},
				};
			},
			forCad(partNumber: string) {
				return convertToURLString(
					baseUrl.$url({
						query: { ProductCode: partNumber, HissuCode: partNumber },
					})
				);
			},
			fromCategoryRecommend: convertToURLString(
				baseUrl.$url({
					query: { rid: 'rid1', list: ItemListName.CATEGORY_RECOMMEND },
				})
			),
			fromInterestRecommend: convertToURLString(
				baseUrl.$url({
					query: { rid: 'rid3', list: ItemListName.INTEREST_RECOMMEND },
				})
			),
		};
	},

	/** Search inCadLibrary page */
	searchInCadLibrary: (
		keyword: string,
		link: string,
		hasSearchFlow?: boolean
	) => {
		const query: Record<string, string> = {
			KWSearch: keyword,
		};
		if (hasSearchFlow) {
			query.searchFlow = 'results2incad';
		}
		return `${link}?${toQueryString(query)}`;
	},
	/** Search inCadLibrary img */
	searchInCadLibraryImage: (eglibCd: string) => {
		return `${config.web.ec.origin}/msmec/ideanote/${eglibCd}/img/img_unit_thum.png`;
	},
	/** Search inCadLibrary All page */
	searchInCadLibraryAll: (keyword: string) => {
		const baseUrl = `${config.web.ec.origin}/asia/incadlibrary/keyword.html`;
		return `${baseUrl}?${toQueryString({
			KWSearch: keyword,
			keyword: keyword,
		})}`;
	},

	/** Search FullTextSearch page */
	searchFullText: (keyword: string, link: string) => {
		return `${link}?${toQueryString({
			KWSearch: keyword,
			searchFlow: 'results2fulltext',
		})}`;
	},

	/** Technical Information page */
	technicalInformation: (keyword: string, link: string) => {
		return `${link}?${toQueryString({
			searchFlow: 'results2techinfo',
			KWSearch: keyword,
		})}`;
	},

	/** CADENAS */
	cadenas: (
		params: Pick<CadenasParameters, 'cadenasResolveUrl' | 'cadenasPloggerUrl'>
	) => {
		return {
			/** resolve.asp */
			resolve: () =>
				params.cadenasResolveUrl.startsWith('//')
					? `https:${params.cadenasResolveUrl}`
					: params.cadenasResolveUrl,
			/** plogger.asp --(HTTP302)--> preview.html */
			preview: () =>
				params.cadenasPloggerUrl.startsWith('//')
					? `https:${params.cadenasPloggerUrl}`
					: params.cadenasPloggerUrl,
		};
	},

	/** SINUS (WEBMEX) */
	sinus: () => {
		return {
			preview: (path: string, language: string) =>
				toUrl(`${config.api.sinus.origin}/sinus/preview.html`, {
					path,
					language,
				}),
			download: () => `${config.api.sinus.origin}/sinus/api/v1/cad/download`,
		};
	},

	/** contactForm from productDetail */
	contactDetail: (seriesCode?: string) => {
		const url = `${seriesCode}`;
		const encodeUrl = encodeURIComponent(url);
		const baseUrl = `${config.web.ec.origin}/asia/Contact.html`;
		if (seriesCode) {
			return `${baseUrl}?series_code=${encodeUrl}`;
		}
		return baseUrl;
	},

	/** Brand */
	brand: (brand: Pick<Brand, 'brandCode' | 'brandUrlCode'>) => {
		const url = pagesPath.vona2.maker._brandCode(
			brand.brandUrlCode ?? brand.brandCode
		);

		return {
			default: convertToURLString(url.$url()),
			category: (...categoryCodeList: string[]) => {
				const makerCategoryPath = url._categoryCode(categoryCodeList);
				return (query?: MakerCategoryQuery) =>
					convertToURLString(makerCategoryPath.$url({ query }));
			},
			/** From keyword search results */
			fromKeywordSearch: (keyword: string) => {
				return convertToURLString(
					url.$url({
						query: { searchFlow: 'results2maker', KWSearch: keyword },
					})
				);
			},
			fromSpecSearch: (
				params: { CategorySpec?: string; Page?: number },
				...categoryCodeList: string[]
			) =>
				convertToURLString(
					url._categoryCode(categoryCodeList).$url({ query: params })
				),
		};
	},

	/**
	 * Category
	 * @param {string[]} categoryCodeList - category code list from top category to current category
	 */
	category(...categoryCodeList: string[]) {
		assertNotEmpty(categoryCodeList);
		const categoryPath = pagesPath.vona2._categoryCode(categoryCodeList);

		return Object.assign(
			(query?: CategoryQuery) =>
				convertToURLString(categoryPath.$url({ query })),
			{
				fromRecommend: (
					cameleerId: string,
					dispPage: string,
					position: number,
					recommendKey: string
				) =>
					convertToURLString(
						categoryPath.$url({
							query: {
								rid: `${cameleerId}_${dispPage}_${position}_${recommendKey}`,
							},
						})
					),
				fromKeywordSearch: (keyword: string) =>
					convertToURLString(
						categoryPath.$url({
							query: { KWSearch: keyword, searchFlow: 'results2category' },
						})
					),
				fromProductDetail: (params: {
					CategorySpec: string;
					Tab?: string;
					FindSimilar?: Flag;
				}) => convertToURLString(categoryPath.$url({ query: params })),
				fromSpecSearch: (params: {
					CategorySpec?: string;
					Page?: number;
					DispMethod?: string;
				}) => convertToURLString(categoryPath.$url({ query: params })),
			}
		);
	},

	/**
	 * Brand Category
	 * @param brand
	 * @param categoryCodeList
	 */
	brandCategory(
		brand: { brandCode: string; brandUrlCode?: string },
		...categoryCodeList: string[]
	) {
		return `${config.web.ec.origin}/vona2/maker/${[
			// if brandUrlCode is empty string, null or undefined, use brandCode
			brand.brandUrlCode || brand.brandCode,
			...categoryCodeList,
		].join('/')}/`;
	},

	/**
	 * Digital Catalog
	 */
	digitalBook2PageView({ digitalBookCode, digitalBookPage }: DigitalBook) {
		return `${
			config.web.digitalCatalog.origin
		}/book/${digitalBookCode}/digitalcatalog.html${
			digitalBookPage ? `?${toQueryString({ page_num: digitalBookPage })}` : ''
		}`;
	},

	/** Catalog image URL */
	digitalBookPage(
		digitalBookCode: string,
		pageIndex: number | string | undefined,
		size: 'o' | '650' | '900'
	) {
		return `${
			config.web.digitalCatalog.origin
		}/book/${digitalBookCode}/${size}/${padZero(pageIndex ?? 0, 4)}.jpg`;
	},

	/**
	 * CAD Download
	 * @param cadUrl
	 * @param fileName
	 * @returns {string} Download url
	 */
	cadDownload(cadUrl: string, fileName: string) {
		return `${
			config.web.ec.origin
		}/vcommon/detail/php/cad_download_name.php?name=${encodeURIComponent(
			fileName
		)}&url=${encodeURIComponent(cadUrl)}`;
	},

	/**
	 * 3D CAD Preview
	 * @param query
	 */
	cadPreview(query: CadPreviewQuery) {
		return `${
			process.env.NEXT_PUBLIC_CAD_PREVIEW_ORIGIN ?? config.web.ec.origin
		}/vona2/3dpreview/?${toQueryString(query)}`;
	},

	/** Web2CAD policy */
	web2cadPolicy: () => {
		return {
			home: () => 'http://www.web2cad.co.jp',
			copyrightEula: () =>
				toUrl('http://www.web2cad.co.jp/copyright/eula.php', {
					language: 'en',
				}),
			copyrightPrivacy: () =>
				toUrl('http://www.web2cad.co.jp/copyright/privacy.php', {
					language: 'en',
				}),
		};
	},

	/** Product details download zip file */
	productDetailsDownloadZip(partNumber: string) {
		return `${
			config.web.ec.origin
		}/vona2/pdf_generate/product_info/${encodeURIComponent(partNumber)}/`;
	},

	//===========================================================================
	// MyPage
	//===========================================================================
	myPage: {
		top: `${config.web.ec.origin}/mypage/`,
		messageList: `${config.web.ec.origin}/mypage/message_list.html`,
		cadDownloadHistory: `${config.web.ec.origin}/mypage/cad_history.html`,
		couponList: `${config.web.ec.origin}/mypage/coupon_message_list.html`,
		myComponents: `${config.web.ec.origin}/mypage/parts.html`,
		cart: `${config.web.ec.origin}/mypage/cart.html`,
		directQuote: `${config.web.ec.origin}/mypage/direct_estimate.html`,
	},

	//===========================================================================
	// WOS
	// - NOTE: wos という括りは、将来まとめて消す必要が出るために付けています。
	//         他でこうした括りは基本的に不要な筈ですので、真似しないようにお願いします。
	//         (理由：無用な括りはメンテの手間を上げるため)
	// - NOTE: wos へのリンクは、2022/1/31 現在、現行サイトでログイン前後に関係なく
	//         ログインURLへのリンクとなっているため、踏襲しています。
	//===========================================================================
	wos: {
		/** Part number checker */
		partNumberChecker: `${config.web.wos.baseUrl}/product/MN001ProductCheckCmd.do`,

		/** User registration */
		userRegistration: (query: Partial<Record<'lang' | 'clkid', string>>) =>
			toUrl(
				`${config.web.wos.baseUrl}/useradmin/US006NewAccountPaymentSelectCmd.do`,
				{ ...query, commandCode: 'NO_AUTH_REGIST_WOS_USER' }
			),
		forgotLoginId: `${config.web.wos.baseUrl}/common/EC055LoginIdReminderRequestCmd.do`,
		forgotPassword: `${config.web.wos.baseUrl}/common/EC016PasswordReminderRequestCmd.do`,

		/** Order */
		order: {
			order: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=SO_NOW`,
				}),
			withCopyAndPaste: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=EC_SO_COPY_AND_PASTE`,
				}),
			withUploadingFile: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=EC_SO_FILE_UPLOAD`,
				}),
			history: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/sohistory/SH002SoHistoryDetailSearchCmd.do?commandCode=TEMP_AUTH_SO_HISTORY`,
				}),
			/** Approval history */
			approvalHistory: (query: Record<'lang', string>) =>
				toUrl(`${config.web.wos.baseUrl}/common/EC003WosTopCmd.do`, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=APPROVAL_HISTORY`,
				}),
		},

		/** Quote */
		quote: {
			/** 견적작성 */
			quote: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=REQUEST_QT`,
				}),
			withCopyAndPaste: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=EC_QT_COPY_AND_PASTE`,
				}),
			withUploadingFile: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=EC_QT_FILE_UPLOAD`,
				}),
			/** 견적이력 */
			history: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/qthistory/QH002QtHistoryDetailSearchCmd.do?commandCode=TEMP_AUTH_QT_HISTORY`,
				}),
			historyDetail: (query: Record<'lang', string>, quotationSlipNo: string) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/qthistory/QH005QtHistoryPoReferenceDetailCmd.do?p1=${quotationSlipNo}&commandCode=TEMP_AUTH_E_CATALOG_HISTORY`,
				}),
		},

		/** Shipment */
		shipment: {
			history: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/deliveryhistory/DH002DeliveryHistoryDetailSearchCmd.do?commandCode=TEMP_AUTH_DELIVERY_HISTORY`,
				}),
			historyByDate: (query: Record<'lang', string>, shipDate?: string) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=TEMP_AUTH_PLANNED_SHIPMENT_LIST&p1=${shipDate}`,
				}),
		},

		/** 반품/교환 신청 일람 Return request */
		returnRequest: (query: Record<'lang', string>) =>
			toUrl(`${config.web.wos.baseUrl}/common/EC003WosTopCmd.do`, {
				...query,
				OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=REQ_RETURN`,
			}),

		/**
		 * Upgrade EC user to WOS user
		 * - EC会員をWOS会員にアップグレードするための画面。支払い方法の登録が必要。
		 */
		upgradeAccount: (query: Record<'lang', string>) =>
			toUrl(`${config.web.wos.baseUrl}/useradmin/US002NewAccountInputCmd.do`, {
				...query,
				commandCode: 'ACCOUNT_UPGRADE',
			}),

		inquiry: {
			/** Check pending quote request */
			quote: (query: Record<'lang', string>) =>
				toUrl(`${config.web.wos.baseUrl}/common/EC003WosTopCmd.do`, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=QT_CHECK`,
				}),

			/** Check pending order request */
			order: (query: Record<'lang', string>) =>
				toUrl(`${config.web.wos.baseUrl}/common/EC003WosTopCmd.do`, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=SO_CHECK`,
				}),
		},

		settings: {
			/** WOS 고객 정보 변경 */
			profile: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=USER_INFORMATION`,
				}),
			/** 비밀번호 변경 */
			changePassword: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=CHANGE_PASSWORD`,
				}),
			/** 미스미 회원정보 */
			myOrganization: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=REGISTRANT_INFO`,
				}),
			/** WOS 설정 변경 */
			changeSettings: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=WOS_SETTINGS`,
				}),
			/** 고객 형번 설정 */
			partNumberNicknameManagement: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=PRODUCT_CODE_REGISTRATION`,
				}),
			/** 배송지 관리 */
			shipToManagement: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL:
						'/shiptomaintenance/EC058ShipToAdministCmd.do?commandCode=RECEIVER_MANAGE_LOAD',
				}),
			shipTo: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/shiptomaintenance/EC058ShipToAdministCmd.do?commandCode=RECEIVER_MANAGE_LOAD`,
				}),
			/** 배송지 추가 */
			newShipToAddress: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=NEW_SHIPPING_ADDRESS`,
				}),
			/** WOS 이용자 관리 */
			userManagement: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do?commandCode=CHILD_USER_MANAGEMENT`,
				}),
		},
		customerStatementDownload: (query: Record<'lang', string>) =>
			toUrl(wosLogin, {
				...query,
				OK_URL: `${config.path.web.wos}/csdownload/CD001CustomerStatementSearchCmd.do`,
			}),
		invoiceList: (query: Record<'lang', string>) =>
			toUrl(wosLogin, {
				...query,
				OK_URL: `${config.path.web.wos}/invoice/BT010InvoiceForeignAPdfCmd.do`,
			}),
		invoice: {
			pdf: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do%3FcommandCode%3DINVOICE_PDF`,
				}),
			apply: (query: Record<'lang', string>) =>
				toUrl(wosLogin, {
					...query,
					OK_URL: `${config.path.web.wos}/common/EC003WosTopCmd.do%3FcommandCode%3DINVOICE_APPLY`,
				}),
		},
		//=========================================================================
		// WOS 静的コンテンツ
		//=========================================================================
		staticContents: {
			/** Payment method guide */
			paymentMethodGuide: (lang: WosLanguageCode) =>
				`${config.web.wos.staticContents.baseUrl}/${lang}/help/SO006_01m.html`,
		},
	},
} as const;

/**
 * Normalize URL for log API
 * @param originalUrl
 */
export const normalizeUrl = (originalUrl: string) => {
	const url = new URL(originalUrl);
	const filteredSearchParams = new URLSearchParams();
	url.searchParams.forEach((value, key) => {
		if (value && !key.startsWith('dev:')) {
			filteredSearchParams.set(key, value);
		}
	});
	url.search = filteredSearchParams.toString();
	return url.toString().replace(/\+/g, '%20');
};

/**
 * URLObject から URL 文字列を取得します。
 * - WARN: これは外部サイト向けのための util です！！アプリ内 Link に使わないでください。
 * @param url
 */
export function convertToURLString(url: UrlObject) {
	// TODO: next の UrlObject -> URL string の機構を使っているが、
	//       なんだか邪悪な感じなので再考したい。
	const [resolved, interpolated] = resolveHref(
		Router,
		url,
		true
	) as unknown as string[];
	return `${config.web.ec.origin}${interpolated ?? resolved}`;
}

/**
 * Get path from URLObject
 */
export function getUrlPath(url: UrlObject) {
	const [resolved, interpolated] = resolveHref(
		Router,
		url,
		true
	) as unknown as string[];

	return `${interpolated ?? resolved}`;
}
