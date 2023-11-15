import type { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import type { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import type { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

const Template = {
	COMPLEX: 'default',
	SIMPLE: 'simple',
	PATTERN_H: 'patternh',
	WYSIWYG: 'wysiwyg',
} as const;
type Template = typeof Template[keyof typeof Template];

export type SharedOptionalQuery = {
	HissuCode?: string;
	ProductCode?: string;
	Template?: Template;
	PNSearch?: string;
	Page?: number;
	CategorySpec?: string;
	CAD?: string;
	HyjnNoki?: string;
	list?: ItemListName;
	Tab?: string;
	rid?: string;
	Keyword?: string;
	searchFlow?: string;
	KWSearch?: string;
	c_value?: string;
};

export type Props = {
	/** search series response */
	seriesResponse: SearchSeriesResponse$detail;
	/** search part number response */
	partNumberResponse: SearchPartNumberResponse$search;
};
