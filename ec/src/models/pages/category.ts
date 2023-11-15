/** Series Sort type */
export const SeriesSortType = {
	POPULARITY: '1',
	PRICE: '2',
	DAYS_TO_SHIP: '5',
} as const;
export type SeriesSortType = typeof SeriesSortType[keyof typeof SeriesSortType];
