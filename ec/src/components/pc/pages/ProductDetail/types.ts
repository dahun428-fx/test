import { Flag } from '@/models/api/Flag';

/** 価格チェックモーダル内で扱うシリーズ情報 */
export type Series = {
	seriesCode: string;
	seriesName: string;
	seriesInfoText?: string[];
	brandName?: string;
	displayStandardPriceFlag: Flag;
};

type SpecValues = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type QueryCondition = {
	page: number;
	daysToShip?: number;
	cad?: string;
} & SpecValues;
