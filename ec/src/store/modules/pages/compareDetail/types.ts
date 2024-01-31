import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

const CompareDetailLoadStatus = {
	INITIAL: 0,
	LOADING: 1,
	LOADED_MAIN: 2,
	READY: 3,
} as const;
type CompareDetailLoadStatus =
	typeof CompareDetailLoadStatus[keyof typeof CompareDetailLoadStatus];
export { CompareDetailLoadStatus };

export type CompareDetailState = {
	status: CompareDetailLoadStatus;
	specItems?: Spec[];
	partNumberItems?: PartNumber[];
	seriesItems?: Series[];
};
export type SpecListType = {
	spec?: Spec;
	diffTypeCode: number;
	specTypeCode?: string;
};
