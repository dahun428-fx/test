/* eslint-disable lines-between-class-members */

type CookieOptions = {
	/** 有効期限 (number は日数) */
	expires?: number;
	path?: string;
	domain?: string;
};

/**
 * Cookie に設定するメンバーを定義するクラス
 * 定義を追加する場合は static な Cookie メンバーを追加してください。
 */
export class Cookie {
	/** セッション */
	static ACCESS_TOKEN_KEY = new Cookie('GACCESSTOKENKEY', {
		expires: 365,
	});
	/** セッション有効期限 */
	static ACCESS_TOKEN_EXPIRATION = new Cookie('ACCESS_TOKEN_EXPIRATION', {
		expires: 365,
	});
	/** リフレッシュトークンハッシュ */
	static REFRESH_TOKEN_HASH = new Cookie('GREFRESHTOKENHASH', {
		expires: 365,
	});
	/** Order Status 表示 */
	static VONAEC_TOP_STATUS = new Cookie('VONAEC_TOP_STATUS', {
		expires: 365,
	});
	/** category view history */
	static CATEGORY_VIEW_HISTORY = new Cookie('categoryviewhist', {
		expires: 365,
	});
	/** view type */
	static VIEW_TYPE = new Cookie('viewType');
	/** view type log */
	static VIEW_TYPE_LOG = new Cookie('viewTypeLog');
	/** view type reload */
	static VIEW_TYPE_RELOAD = new Cookie('viewTypeReload');
	/** recently viewed category */
	static RECENTLY_VIEWED_CATEGORY = new Cookie('recentryCategoryView', {
		expires: 365,
	});
	/** series view history */
	static SERIES_VIEW_HISTORY = new Cookie('seriesviewhist', {
		expires: 365,
	});
	/** recently viewed series */
	static RECENTLY_VIEWED_SERIES = new Cookie('VONAEC_RECENT_SERIES_VIEW', {
		expires: 365,
	});
	/** User code cookie for Adobe Analytics */
	static MSM_USER_CODE = new Cookie('msm_usercd', {
		// NOTE: On PHP code value is 0.02 but cookie list document value is 365
		expires: 0.02,
	});

	// NOTE: By default, cookies will be set with [.misumi-ec.com] domain.
	//       But following ones, sub domain is required [xx.misumi-ec.com].
	//       xx: 2-digit country code (my: Malaysia, uk: UK, de: Germany,...)
	//       By setting domain to [''], host with sub domain will be set to cookie.
	/** 新着メッセージ表示済みか (expires は保存時に指定) */
	static VONAEC_UNCONFIRMED = new Cookie('VONAEC_UNCONFIRMED', {
		domain: '',
	});
	/** VONAEC already member */
	static VONAEC_ALREADY_MEMBER = new Cookie('VONAEC_ALREADY_MEMBER', {
		domain: '',
	});
	/** Customer code */
	// NOTE: Wrong definition on cookie list document (expiration is 365)
	static CUSTOMER_CODE = new Cookie('CUSTCD', {
		domain: '',
	});
	/**
	 * ミスミ独自のユーザ追跡キー
	 * CRMサービスやのパラメーターとして利用される。
	 */
	static VONA_COMMON_LOG_KEY = new Cookie('VONA_COMMON_LOG_KEY', {
		expires: 365 * 10 + 2, // 10年。2 は閏年の分
		domain: '',
	});

	/** Stores the ID to track the user */
	static VONA_LOG_ID = new Cookie('VONALOGID', {
		expires: 365 * 10 + 2, // 10年。2 は閏年の分
		domain: '',
	});

	/** Cad data format */
	static CAD_DATA_FORMAT = new Cookie('CAD_DATA_FORMAT', {
		expires: 90,
	});

	/** Cad confirmed */
	static VONA2_CONFIRMED_CAD = new Cookie('VONA2_CONFIRMED_CAD', {
		expires: 365,
	});

	/** Cad confirmed web2cad */
	static VONA2_CONFIRMED_WEB2CAD = new Cookie('VONA2_CONFIRMED_web2CAD', {
		expires: 365,
	});

	/** cookie for pageSize product detail */
	static VONA_ITEM_DETAIL_PER_PAGE = new Cookie('vonaItemDetailPerPage', {
		expires: 90,
		domain: '',
	});

	/** cookie for pageSize for keyword search */
	static VONA_ITEM_RESULT_PER_PAGE = new Cookie('vonaItemResultPerPage', {
		expires: 90,
		domain: '',
	});

	/** cookie for pageSize for spec search */
	static VONA_ITEM_SEARCH_PER_PAGE = new Cookie('vonaItemSearchPerPage', {
		expires: 90,
		domain: '',
	});

	/** cookie name */
	private readonly _name: string;

	/** cookie options */
	private readonly _options: CookieOptions;

	private constructor(name: string, options: CookieOptions = {}) {
		this._name = name;
		this._options = options;
	}

	/** cookie name */
	get name() {
		return this._name;
	}

	/** cookie options */
	get options() {
		return this._options;
	}
}
