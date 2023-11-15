import { CadType } from '@/logs/analytics/adobe/events/types/DownloadCad';
import { LoginMethod } from '@/logs/analytics/adobe/events/types/LoggedInEvents';
import { ClassCode } from '@/logs/constants';

/** Variables for AA */
export type GlobalVariables = {
	/** class code */
	sc_class_cd?: ClassCode;
	sc_class_name?: string;

	sc_display_lang?: string;

	/** category code */
	sc_category0_cd?: string;
	sc_category1_cd?: string;
	sc_category2_cd?: string;
	sc_category3_cd?: string;
	sc_category4_cd?: string;
	sc_category5_cd?: string;

	/** brand code */
	sc_brand_cd?: string;

	/** series code */
	sc_products_cd?: string;

	/** for simple product page */
	sc_class_name_simple_product?: string;

	sc_proevents?: string;

	sc_sort_type?: string;
};

/** AA Event Functions */
type Functions = {
	/** Page view event */
	sc_f_spascreen_display?: (referrer?: string | null) => void;

	sc_f_login_success?: (userCode?: string, loginType?: LoginMethod) => void;

	sc_f_nonecatalog_view?: (
		partNumber?: string,
		brandCode?: string,
		brandName?: string
	) => void;

	sc_f_nonecatalog_ordernow?: (
		partNumber?: string,
		brandCode?: string,
		brandName?: string
	) => void;

	sc_f_nonecatalog_cartadd?: (
		partNumber?: string,
		brandCode?: string,
		brandName?: string
	) => void;

	/** on 3D preview */
	sc_f_products_3dtab?: () => void;

	/** on add part numbers to my components */
	sc_f_products_mycompornents_save?: (partNumberCount?: number) => void;

	/** on generate part number */
	sc_f_products_pn_gen?: () => void;

	/** on check price */
	sc_f_products_price_check?: (partNumberCount?: number) => void;

	/** on order now */
	sc_f_products_ordernow?: (partNumberCount?: number) => void;

	/** on cart add */
	sc_f_products_cart_add?: (
		sc_category0_cd: string,
		sc_category1_cd: string,
		sc_category2_cd: string,
		sc_category3_cd: string,
		sc_category4_cd: string,
		sc_category5_cd: string,
		brandCode: string,
		seriesCode: string,
		partNumberCount?: number
	) => void;

	/** on quote directwos */
	sc_f_products_quote_directwos?: () => void;

	/** on download product details */
	sc_f_product_sheetDL?: () => void;

	/** on download catalog */
	sc_f_products_pdf_dl?: () => void;

	/** on click catalog tab */
	sc_f_products_catalogtab?: () => void;

	/** download CAD */
	sc_f_products_cad_dl?: (cadType: CadType) => void;

	/** on click add-to-cart or order-now */
	sc_searchresultnonecatalog_sku_gen?: (
		partNumber: string,
		brandCode: string
	) => void;

	/** on keyword search all result received */
	sc_f_search_results?: (
		brandCount: number,
		categoryCount: number,
		seriesCount: number,
		fullTextCount: number,
		discontinuedCount: number,
		techInformationCount: number,
		partNumberTypeCount: number,
		inCadLibraryCount: number,
		cNaviCount: number,
		otherPartNumberCount: number
	) => void;

	/** on click fullText area */
	sc_f_result2fulltext?: () => void;

	/** display Combo */
	sc_searchresult_onlycombo?: () => void;

	/** on click combo partNumber */
	sc_searchresult_comboclicktopn?: (
		brandCode: string,
		seriesCode: string,
		partNumber: string
	) => void;

	/** on click techInfo area */
	sc_f_result2techinfo?: () => void;

	/** select sort type */
	sc_f_products_list_sort?: (sortType: string) => void;
};

export type AdobeAnalyticsFields = GlobalVariables & Functions;
