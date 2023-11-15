import React from 'react';
import { PurchaseConditions } from './PurchaseConditions';
import { OverlayLoader } from '@/components/mobile/ui/loaders';
import { CurrencyProvider } from '@/components/mobile/ui/text/Price';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

type Props = {
	checking?: boolean;
	price: Price | null;
	series: Series;
	disableQuote: boolean;
	quote: () => void;
};

/**
 * Price check result component
 */
export const PriceCheckResult: React.VFC<Props> = ({
	checking,
	price,
	series,
	disableQuote,
	quote,
}) => {
	return (
		<CurrencyProvider ccyCode={price?.currencyCode}>
			<PurchaseConditions
				price={price}
				series={series}
				quote={quote}
				disableQuote={disableQuote}
			/>
			{checking && <OverlayLoader />}
		</CurrencyProvider>
	);
};
PriceCheckResult.displayName = 'PriceCheckResult';
