import { Translation } from '@/i18n/types';

export const productDetailsDownloadCadenas: Translation = {
	loadingTitle: '3D model in generation - please wait',
	loadingMessage:
		'It will take approx. {{ estimatedTime }} sec to generate CAD data.<0></0>Please wait until the generating process is completed.',
	error: {
		notResolved: {
			noZipFile: 'The CAD file is not included in this product’s ZIP file.',
			alternativeLink:
				'Please download a comparable CAD file from the link below. We apologize for any inconvenience.',
			cadConfigurator: 'CAD Configurator',
		},
		noCadData: {
			title: 'No CAD data available for the selected product.',
			message:
				'Connection Error. Please reselect your configuration <0>from this link</0>.',
		},
	},
};
