import { AdobeAnalyticsFields } from '@/logs/analytics/adobe/pageView/types/globalFields';
import { GoogleAnalyticsFields } from '@/logs/analytics/google/GlobalFields';

type ChatPlusDocument = {
	/** ChatPlus URL */
	__cp_d?: string;
	/** site id */
	__cp_c?: string;
	/** params */
	__cp_p?: {
		/** user code */
		externalKey: string;
		/** user name + user code */
		perhapsName: string;
		/** customer code + customer name */
		perhapsCompanyName: string;
		/** referrer (URLではありません。"ec" などの短い識別子です) */
		referrer: string;
	};
};

declare global {
	interface Window extends AdobeAnalyticsFields, GoogleAnalyticsFields {
		// Cameleer js
		Cameleer?: {
			toastCategory: (categoryCode: string | string[]) => void;
			toastSeries: (seriesCode: string | string[]) => void;
			impression_tracker: (
				itemCd: string,
				recommendCd: string,
				uid: string,
				dispPage: string,
				position: number,
				userCd: string
			) => void;
			click_tracker: (
				itemCd: string,
				recommendCd: string,
				uid: string,
				dispPage: string,
				position: number,
				userCd: string
			) => void;
		};
	}

	interface Document extends ChatPlusDocument {}
}
