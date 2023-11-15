import { GlobalVariables } from '@/logs/analytics/adobe/pageView/types/globalFields';

// Global variables initial values
const variablesInitialValues: {
	[P in keyof Required<GlobalVariables>]: GlobalVariables[P];
} = {
	sc_class_cd: undefined,
	sc_class_name: undefined,
	sc_display_lang: undefined,

	sc_category0_cd: undefined,
	sc_category1_cd: undefined,
	sc_category2_cd: undefined,
	sc_category3_cd: undefined,
	sc_category4_cd: undefined,
	sc_category5_cd: undefined,

	sc_brand_cd: undefined,
	sc_products_cd: undefined,
	sc_class_name_simple_product: undefined,
	sc_proevents: undefined,
	sc_sort_type: undefined,
};

/**
 * Clear global variables.
 */
export function clearVariables() {
	Object.assign(window, variablesInitialValues);
}
