import { GlobalVariables } from '@/logs/analytics/google/GlobalFields';

// Global variables initial values
const variablesInitialValues: {
	[P in keyof Required<
		Omit<GlobalVariables, 'dataLayer' | 'ga_custmer' | 'ga_usercd'>
	>]: GlobalVariables[P];
} = {
	ga_class_cd: undefined,
	ga_division_cd: undefined,
	ga_class_name: undefined,
	ga_MorV: undefined,
	ga_products_cd: undefined,
	ga_products_name: undefined,
	ga_brand_cd: undefined,
	ga_brand_name: undefined,
	ga_category1_cd: undefined,
	ga_category1_name: undefined,
	ga_category2_cd: undefined,
	ga_category2_name: undefined,
	ga_category3_cd: undefined,
	ga_category3_name: undefined,
	ga_category4_cd: undefined,
	ga_category4_name: undefined,
	ga_category5_cd: undefined,
	ga_category5_name: undefined,
	ga_proevents: undefined,
	ga_newcategoryID: undefined,
	ga_class_name_simple_product: undefined,
	ga_user_type: undefined,
	ga_pn_cd: undefined,
	ga_inner_cd: undefined,
	ga_sort_type: undefined,
	ga_ctg_templatetype: undefined,
	ga_layout: undefined,
	ga_number: undefined,
	ga_products_class: undefined,
	ga_pageType: undefined,
};

/**
 * Clear global variables.
 */
export function clearVariables() {
	Object.assign(window, variablesInitialValues);
}
