import { Translation } from '@/i18n/types';

export const meta: Translation = {
	title: {
		default: '{{formattedTab}}{{seriesName}} | {{brandName}} | MISUMI Malaysia',
		formatTab: '{{tab}} | ',
	},
	description: {
		default:
			'{{seriesName}} from {{brandName}}{{formattedTab}}. MISUMI offers free shipping, free CAD downloads, short lead times, competitive pricing, and no minimum order quantity. Purchase {{seriesName}} from {{brandName}} now.',
		formatTab: ' ({{tab}})',
	},
	keywords: '{{brandName}},{{seriesName}},{{categoryNames}},{{seoKeywords}}',
};
