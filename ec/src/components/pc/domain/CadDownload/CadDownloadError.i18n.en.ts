import { Translation } from '@/i18n/types';

export const cadDownloadError: Translation = {
	notFixedPartNumberError: {
		message:
			'CAD download and 3D preview are not available because the part number has not yet been determined',
		guide: `*In order to open the CAD download and 3D preview screen, the part number must be fixed.<0></0>Please confirm the part number from "Specification / Dimension"on the left side, and then perform the CAD Download / 3D Preview operation`,
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
