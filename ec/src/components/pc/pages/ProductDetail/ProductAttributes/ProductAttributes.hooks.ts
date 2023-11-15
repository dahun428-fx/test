import { useSelector } from '@/store/hooks';
import {
	selectSeries,
	selectCurrentPartNumberResponse,
	selectFaqResponse,
	selectProductPriceInfo,
} from '@/store/modules/pages/productDetail';

export const useProductAttributes = () => {
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);
	const priceInfo = useSelector(selectProductPriceInfo);

	const { totalCount: faqCount } = useSelector(selectFaqResponse) ?? {};

	return { series, partNumberResponse, faqCount, priceInfo };
};
