export type Config = Global & Subsidiary & Country & Language & Env & Site;

/** Global common config */
export type Global = {
	/** CDN */
	cdn: {
		domain: {
			cloudinary: {
				/** Cloudinary domain for Misumi global */
				global: string;
				/** Cloudinary domain only for Misumi China */
				china: string;
			};
			images: string;
		};
	};
};

/**
 * Subsidiary level config
 * - JKT, MJP, TIW, ...
 * - WARN: Do not set the currency code. Available currencies vary by customer.
 *         通貨コードは設定しないでください。利用可能な通貨は、得意先によって異なります。
 */
export type Subsidiary = {
	subsidiaryCode: string;
	locales: string[];
	defaultCurrencyCode: string;
	cookie: {
		domain: string;
	};
	path: {
		web: {
			/**
			 * WOS root path
			 * @example "/id"
			 */
			wos: string;
			/**
			 * WOS static contents root path
			 * @example "/contents/th"
			 */
			wosStaticContents: string;
			/**
			 * User registration guide
			 * 会員登録ガイド
			 */
			userRegistrationGuide: string;
			/**
			 * inCAD Library
			 * - TODO: インドネシアになさそうなので、ないで確定なら扱いを決めて対応する。
			 */
			// inCadLibrary: string;
			/**
			 * Piece charge guide
			 * バラチャージガイド
			 * - TODO: インドネシアにないなら、扱いを決めて対応する。
			 */
			// pieceChargeGuide: string;
		};
	};
	form: {
		length: {
			max: Record<'loginId' | 'password' | 'keyword' | 'quantity', number>;
			// min: {},
		};
	};
	pagination: {
		detail: {
			size: number;
			sizeList: number[];
		};
		series: {
			size: number;
			sizeList: number[];
		};
		techView: {
			size: number;
			sizeList: number[];
		};
	};
};

/**
 * Country level config
 * - id, th, ...
 */
export type Country = {
	format: {
		date: string;
		dateTime: string;
		monthYear: string;
		number: {
			/** Decimal separator 桁区切り文字 */
			decimalSeparator: string;
			/** Decimal point 小数点 */
			decimalPoint: string;
		};
	};
};

/**
 * Language level config
 * - en, th, ...
 */
export type Language = {
	defaultLocale: string;
};

/**
 * Env level config
 * - dev, stg, chk, prd, ...
 */
export type Env = {
	/** env id */
	env: 'dev' | 'stg' | 'chk' | 'prd';
	/** ApplicationId for API requests */
	applicationId: {
		/** msm-api family, example: ect-api */
		msm: string;
	};
};

/**
 * Site level config
 * - stg0, stg1, stg3, ...
 */
export type Site = {
	api: {
		/** msm-api family */
		msm: Api;
		/** ect-api */
		ect: Api;
		/** mauth-api */
		auth: Api;
		/** sinus-api */
		sinus: Api;
		/** cadenas-api */
		cadenas: Api;
		/** cameleer-api */
		cameleer: Api;
		/** legacy */
		legacy: {
			/** SSI contents server (いつの日か消える) */
			htmlContents: Api;
			/** CMS */
			cms: Api;
		};
	};
	web: {
		/**
		 * EC web
		 * - You mainly use this to verify the correctness of links to static content during local development.
		 *   主に静的コンテンツへのリンクの正しさをローカル開発時に確認するために使います。
		 */
		ec: Web;
		/** WOS */
		wos: Wos;
		/** Digital Catalog */
		digitalCatalog: Web;
	};
	/** Settings of datadogRUM. See the link for confirming parameter detail.　https://docs.datadoghq.com/ja/real_user_monitoring/installation/?tab=us */
	datadogRUM: {
		applicationId: string;
		clientToken: string;
		site: string;
		service: string;
		env: string;
		sampleRate: number;
		trackInteractions: boolean;
		defaultPrivacyLevel: 'mask-user-input' | 'mask' | 'allow';
	};
	metaTags: {
		formatDetection: {
			mobile: string;
		};
	};
};

//=============================================================================
// Types in config

type Api = {
	/**
	 * Origin
	 * - https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Origin
	 * - NOTE: 当面の間、ローカル開発においては localhost に立てた CORS 回避 proxy サーバを
	 *         経由して SSI コンテンツを取得することになると想定し、その場合簡易サーバなので
	 *         https ではなく http になるため、domain ではなく origin としています。
	 *         http://localhost:3031/vcommon/... などになる想定。
	 */
	origin: string;
};

type Web = Api;

/** WOS */
type Wos = {
	/**
	 * Base URL
	 * - WOS は {origin}/{countryCode} が baseUrl のため origin ではなく baseUrl としています。
	 */
	baseUrl: string;

	/**
	 * WOS static contents server
	 * WOS 静的コンテンツサーバ
	 */
	staticContents: {
		/**
		 * Base URL
		 * - WOS 静的コンテンツサーバは {origin}/contents/{countryCode} が baseUrl のため
		 *   origin ではなく baseUrl としています。
		 */
		baseUrl: string;
	};
};
