const ClassCode = {
	OTHER: 'other',
	TOP: 'top',
	DETAIL: 'detail',
	KEYWORD_SEARCH: 'keywsrchview',
	SEARCH: 'search',
	CAD_PREVIEW: '3dpreview',
	MAKER_LIST: 'contents',
	MAKER: 'brand',
	MAKER_TOP: 'mtop',
	MAKER_CATEGORY_TOP: 'mctop',
	CATEGORY_TOP: 'ctop',
	CATEGORY: 'ctg',
	GRAND_CATEGORY: 'ctg1',
	LARGE_CATEGORY: 'ctg2',
	MIDDLE_CATEGORY: 'ctg3',
	SMALL_CATEGORY: 'ctg4',
	LITTLE_CATEGORY: 'ctg5',
	NOT_FOUND: '404',
	ERROR_PAGE: 'ErrorPage',
	// more...
} as const;
type ClassCode = typeof ClassCode[keyof typeof ClassCode];

export { ClassCode };
