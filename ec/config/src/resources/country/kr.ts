import { Country } from '@/config/types';

export const kr: Country = {
	format: {
		date: 'YYYY-MM-DD',
		dateTime: 'YYYY-MM-DD HH:mm:ss',
		monthYear: 'YYYY년MM월',

		// TODO: Remove this (?) Not used in the code.
		number: {
			decimalSeparator: ',',
			decimalPoint: '.',
		},
	},
};
