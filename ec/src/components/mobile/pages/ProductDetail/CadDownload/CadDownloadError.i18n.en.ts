import { Translation } from '@/i18n/types';

export const cadDownloadError: Translation = {
	notFixedPartNumberError: {
		message: '<1>Incomplete part number.</1>',
		guide: 'Please complete the part number and perform CAD Download again.',
	},
	ie11: {
		message: 'This site is not available for your browser',
		guide:
			'*For downloading CAD data/3D Preview of the selected product, it is necessary to use Internet Explorer 11.0 or later, Edge, Chrome, Firefox',
	},
	notAvailable: {
		message: 'CAD Data is not available for the selected part number',
		guide: 'Sorry for your inconvenience, but please reselect again',
	},
};
