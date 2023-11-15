import { clearVariables } from './clearVariables';
import { trackPageView } from './trackPageView';
import { ClassCode } from '@/logs/constants';

/** Error page tracking */
export async function trackError() {
	await setVariables();
	trackPageView();
}

/** set global variables */
async function setVariables() {
	clearVariables();
	window.ga_class_cd = ClassCode.ERROR_PAGE;
	window.ga_class_name = 'ErrorPage_Except for 404';
	window.ga_pageType = ClassCode.ERROR_PAGE;
}
