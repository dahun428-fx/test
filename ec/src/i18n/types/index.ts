export type Translation = {
	[i18nKey: string]: string | Translation;
};

export type Resource = {
	/** translation namespace (i18next default namespace) */
	translation: Translation;
};

type Language = 'ko';

// export type Resources = Record<Language, Resource>;
export type Resources = {
	[language: string]: Resource;
};
