export type Translation = {
	[i18nKey: string]: string | Translation;
};

export type Resource = {
	/** translation namespace (i18next default namespace) */
	translation: Translation;
};

// type Language = 'ko';
type LanguageKorean = 'ko';
type LanguageEnglish = 'en';

export type ResourcesKo = Record<LanguageKorean, Resource>;
export type ResourcesEn = Record<LanguageEnglish, Resource>;
