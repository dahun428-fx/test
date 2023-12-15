import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { config } from '@/config';
import { resources as mobileResources } from '@/i18n/mobile/resources';
import { resources as pcResources } from '@/i18n/pc/resources';
import { resources as sharedResources } from '@/i18n/shared/resources';
import { assertNotNull } from '@/utils/assertions';

if (!i18n.isInitialized) {
	assertNotNull(pcResources.ko);
	assertNotNull(mobileResources.en);

	i18n
		.use(initReactI18next)
		.init({
			debug: process.env.NODE_ENV === 'development',
			// NOTE: https://stackoverflow.com/a/70521614
			compatibilityJSON: 'v3',
			resources: {
				ko: {
					translation: {
						...pcResources.ko.translation,
						...mobileResources.en.translation,
						// ...sharedResources.en.translation,
					},
				},
			},
			lng: config.defaultLocale,
			fallbackLng: config.defaultLocale,
			interpolation: {
				// not needed for react https://github.com/i18next/react-i18next/issues/277
				escapeValue: false,
			},
		})
		.then();
}
