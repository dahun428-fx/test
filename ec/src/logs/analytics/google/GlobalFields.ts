import { MisumiOrVona } from '@/logs/analytics/google/types';
import { ClassCode } from '@/logs/constants';

/** Variables for GA */
export type GlobalVariables = {
	dataLayer?: object[];

	// user attributes
	/** customer code */
	ga_custmer?: string; // <- "custmer" is not typo...
	/** user code */
	ga_usercd?: string;
	/** user type (purchase link user or else) */
	ga_user_type?: 'procurement' | '';
	/** class code (screen code?) */
	ga_class_cd?: ClassCode;
	/** class name (screen name?) */
	ga_class_name?: string;

	ga_division_cd?: string;
	ga_MorV?: MisumiOrVona;
	// series
	ga_products_cd?: string;
	ga_products_name?: string;
	// brand
	ga_brand_cd?: string;
	ga_brand_name?: string;
	// category
	ga_category1_cd?: string;
	ga_category1_name?: string;
	ga_category2_cd?: string;
	ga_category2_name?: string;
	ga_category3_cd?: string;
	ga_category3_name?: string;
	ga_category4_cd?: string;
	ga_category4_name?: string;
	ga_category5_cd?: string;
	ga_category5_name?: string;
	// inner / part number
	ga_pn_cd?: string;
	ga_inner_cd?: string;

	ga_proevents?: 'detail';
	// department code / top category code
	ga_newcategoryID?: string;

	ga_sort_type?: string;

	ga_class_name_simple_product?: string;

	ga_ctg_templatetype?: string;

	ga_layout?: string;

	ga_number?: string;

	ga_products_class?: string;

	ga_pageType?: string;
};
export type GoogleAnalyticsFields = GlobalVariables;
