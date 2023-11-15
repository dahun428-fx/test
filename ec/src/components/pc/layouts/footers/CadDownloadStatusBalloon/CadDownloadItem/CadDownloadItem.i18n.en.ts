import { Translation } from '@/i18n/types';

export const cadDownloadItem: Translation = {
	target: 'Part number <0>{{partNumber}}</0> ({{label}})',
	message: {
		done: 'The CAD data has been generated.',
		pending: {
			sinus: 'The CAD data is being generated. Please wait',
			cadenas:
				'A time period of approx. {{time}}sec. is required to generate the CAD data. Please wait until the generating process is completed.',
		},
		timeout:
			'Failed to generate CAD data. When the page is updated, the generation will be performed again.',
	},
};
