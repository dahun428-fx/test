import { ClassCode } from '@/logs/constants';

type PageView = {
	sc_class_cd?: ClassCode;
	sc_class_name?: string;
	sc_display_lang?: string;
};

type PageViewSearchResult = PageView & { sc_proevents?: string };

export type PageViewPayload = PageView | PageViewSearchResult;
