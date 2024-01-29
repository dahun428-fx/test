import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type SeriesCode = string;
type PartNumber = string;

export type CompareDetailState = {
	seriesResponse: SearchSeriesResponse$search | null;
	partNumberResponses: Record<
		`${SeriesCode}\t${PartNumber}`,
		SearchPartNumberResponse$search | undefined
	> | null;
};
