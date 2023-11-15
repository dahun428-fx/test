import { Translation } from '@/i18n/types';

export const productDetailsDownloadSinus: Translation = {
	fileFormatLabel: 'File Format',
	loadingTitle: '3D model in generation - please wait',
	error: {
		noSupportBrowser: {
			title: 'CAD Data Download is not available in your browser.',
			messageOne:
				"*To download CAD Data, it's required to use Internet Explorer 11.0 or later, Edge, Chrome or Firefox.",
			messageTwo:
				'To only download product information, please click the [Download ZIP File] button.',
		},
		notResolved: {
			messageOne: 'The CAD file is not included in this product’s ZIP file.',
			messageTwo: 'We apologize for any inconvenience.',
		},
		generatedFailed: {
			messageOne: 'CAD Data generation failed.',
			messageTwo:
				'Please use it after a while or click the [Download ZIP File] button to download only the product information.',
		},
	},
};
