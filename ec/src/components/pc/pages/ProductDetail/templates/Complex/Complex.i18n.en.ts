import { basicInformation } from './BasicInformation/BasicInformation.i18n.en';
import { specPanel } from './SpecPanel/SpecPanel.i18n.en';
import { Translation } from '@/i18n/types';

export const complex: Translation = {
	specPanel,
	basicInformation,
	meta: {
		title: '{{seriesName}} | {{brandName}} | MISUMI Malaysia',
		page: '(Page {{page}})Part Number',
		description:
			'{{seriesName}} from {{brandName}}{{dynamicName}}. MISUMI offers free shipping, free CAD downloads, short lead times, competitive pricing, and no minimum order quantity. Purchase {{seriesName}} from {{brandName}} now.',
		dynamicNameWithPage: '(Part numbers) Page{{page}}',
	},
};
