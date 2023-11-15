import React from 'react';
import { ProductAttributes as Presenter } from './ProductAttributes';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	partNumberResponse: SearchPartNumberResponse$search;
};

export const ProductAttributes: React.VFC<Props> = ({
	seriesResponse: {
		seriesList: [series],
		currencyCode,
	},
	partNumberResponse: { totalCount, partNumberList },
}) => {
	assertNotNull(series);
	return (
		<Presenter {...{ series, currencyCode, totalCount, partNumberList }} />
	);
};
ProductAttributes.displayName = 'ProductAttributes';
