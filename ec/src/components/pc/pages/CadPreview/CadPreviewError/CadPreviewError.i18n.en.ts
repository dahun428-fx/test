import { Translation } from '@/i18n/types';

export const cadPreviewError: Translation = {
	headword: {
		noSupportBrowser: 'This site is not available for your browser.',
		unavailablePartNumber:
			'CAD Data is not available for the selected part number.',
		partNumberIncomplete:
			'CAD download and 3D preview are not available because the part number has not yet been determined.',
	},
	primaryNote: {
		partNumberIncomplete:
			'*In order to open the CAD download and 3D preview screen, the part number must be fixed',
		unavailablePartNumberSinus:
			'Sorry for your inconvenience, but please reselect again',
		noSupportBrowserSinus:
			'*For downloading CAD data/3D Preview of the selected product, it is necessary to use Internet Explorer 11.0 or later, Edge, Chrome, Firefox',
		unknownServerError: 'Acquisition failed. Please use it after a while.',
	},
	secondaryNote: {
		partNumberIncomplete:
			'Please confirm the part number from "Specification / Dimension"on the left side, and then perform the CAD Download / 3D Preview operation',
	},
};
