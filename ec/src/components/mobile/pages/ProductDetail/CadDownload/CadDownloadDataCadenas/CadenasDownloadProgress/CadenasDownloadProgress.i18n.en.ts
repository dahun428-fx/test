import { Translation } from '@/i18n/types';

export const cadenasDownloadProgress: Translation = {
	title: {
		generating: 'Generating 3D Model. Please wait.',
		generated: 'CAD model generated.',
	},
	target: 'Part number: {{partNumber}}',
	message: {
		generating:
			'The time period of approx. {{time}}sec. is required to generate the CAD data. Please wait until the generating process is completed.',
		generated:
			'If download does not start automatically, for file please click below.',
	},
};
