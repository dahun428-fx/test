import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { config } from '@/config';
import { resources as mobileResources } from '@/i18n/mobile/resources';
import { resources_en as pcResourcesEn } from '@/i18n/pc/resources';
import { resources_ko as pcResourcesKo } from '@/i18n/pc/resources';
import { resources as sharedResources } from '@/i18n/shared/resources';

if (!i18n.isInitialized) {
	i18n
		.use(initReactI18next)
		.init({
			debug: process.env.NODE_ENV === 'development',
			// NOTE: https://stackoverflow.com/a/70521614
			compatibilityJSON: 'v3',
			resources: {
				en: {
					translation: {
						...pcResourcesEn?.en.translation,
						...mobileResources?.en.translation,
						...sharedResources?.en.translation,
					},
				},
				ko: {
					translation: {
						...pcResourcesKo.ko.translation,
						...mobileResources.en.translation,
						...sharedResources.en.translation,
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
