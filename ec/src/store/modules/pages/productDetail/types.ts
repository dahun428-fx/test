import type { TemplateType } from '@/models/api/constants/TemplateType';
import { SearchFaqResponse } from '@/models/api/msm/ect/faq/SearchFaqResponse';
import { SearchInterestRecommendResponse } from '@/models/api/msm/ect/interestRecommend/SearchInterestRecommendResponse';
import { Sort } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	PartNumber,
	SearchPartNumberResponse$search,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { SearchPurchaseRecommendResponse } from '@/models/api/msm/ect/purchaseRecommend/SearchPurchaseRecommendResponse';
import { SearchRelatedPartNumberResponse } from '@/models/api/msm/ect/relatedPartNumber/SearchRelatedPartNumberResponse';
import {
	SearchSeriesResponse$detail,
	Series,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { SearchUnitLibraryResponse } from '@/models/api/msm/ect/unitLibrary/SearchUnitLibraryResponse';
import { QnaResponse } from '@/models/api/qna/SearchQnaResponse';
import { ReviewResponse } from '@/models/api/review/SearchReviewResponse';

export type ProductDetailState = {
	/** product detail page display template type */
	templateType: TemplateType | null;
	/** search series response */
	seriesResponse: SearchSeriesResponse$detail | null;
	/**
	 * search part number response
	 * by default condition
	 */
	partNumberResponse: SearchPartNumberResponse$search | null;
	/**
	 * search part number response
	 * by user selected search criteria
	 */
	currentPartNumberResponse: SearchPartNumberResponse$search | null;
	/**
	 * price check response
	 */
	priceCache: Record<`${Price['partNumber']}\t${Price['quantity']}`, Price>;

	/** related part number list */
	relatedPartNumberResponse?: SearchRelatedPartNumberResponse;
	/** faq list */
	faqResponse?: SearchFaqResponse;
	/** purchase recommend list */
	purchaseRecommendResponse?: SearchPurchaseRecommendResponse;
	/** unit library list */
	unitLibraryResponse?: SearchUnitLibraryResponse;
	/** interest recommend list */
	interestRecommendResponse?: SearchInterestRecommendResponse;
	interestRecommendSeriesList?: Series[];

	/** loading part number list */
	loading?: boolean;
	/** checking price */
	checking?: boolean;
	/** order quantity */
	quantity?: number | null;
	/** part number list page */
	page?: number;
	sort?: Sort | Sort[];

	/** part number for Pattern H */
	inputPartNumber?: string;

	/** User review */
	reviewResponse?: ReviewResponse;
	/** User Qna */
	qnaResponse?: QnaResponse;
} & ComplexState &
	MobileState;

type ComplexState = {
	focusesAlterationSpecs?: boolean;
};

type MobileState = {
	showsSpecPanel?: boolean;
	showsPartNumberListPanel?: boolean;
};

/** Part number for the part number list in simple series view */
export type SimplePartNumber = Pick<Series, 'seriesCode' | 'brandCode'> &
	Pick<SearchPartNumberResponse$search, 'currencyCode'> &
	Pick<
		PartNumber,
		| 'partNumber'
		| 'innerImage'
		| 'standardUnitPrice'
		| 'campaignUnitPrice'
		| 'campaignEndDate'
		| 'minStandardDaysToShip'
		| 'maxStandardDaysToShip'
		| 'piecesPerPackage'
		| 'content'
		| 'minQuantity'
		| 'iconTypeList'
		| 'orderUnit'
		| 'relatedLinkList'
		| 'specValueList'
		| 'cadTypeList'
		| 'rohsFlag'
		| 'regulationValueList'
	> & {
		specList: { specCode: string; specValueDisp: string }[];
	};
