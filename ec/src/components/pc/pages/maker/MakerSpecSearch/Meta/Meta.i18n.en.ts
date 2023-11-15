import { Translation } from '@/i18n/types';

export const meta: Translation = {
	title:
		'{{titlePage}}{{titleSpec}}{{makerSpecTitle}} from {{titleBrandName}} | MISUMI Malaysia{{titleSpecName}}',
	description:
		'{{categoryName}}{{categorySpec}} from {{brandName}}{{descriptionPage}} for industrial applications. MISUMI offers free shipping, free CAD downloads, short lead times, competitive pricing, and no minimum order quantity. Purchase {{categoryName}}{{categorySpec}} from {{brandName}} now.',
	categorySpecForDescription: ' ({{specName}}:{{specValueDisp}})',
	categorySpecForKeyword: ',{{specName}}：{{specValueDisp}}',
	keywords:
		'{{brandName}},{{categoryName}},{{categoryRouteForKeywords}}{{categorySpec}},{{seoKeywords}}',
	titlePage: '(Page{{page}})',
	descriptionPage: ' Page{{page}}',
};
