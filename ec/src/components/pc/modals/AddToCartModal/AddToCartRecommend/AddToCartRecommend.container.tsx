import { useCallback, useState } from 'react';
import { AddToCartRecommend as Presenter } from './AddToCartRecommend';
import { getCartInModalRecommend } from '@/api/services/cameleer/getCartInModalRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetCartInModalRecommendResponse } from '@/models/api/cameleer/getCartInModalRecommend/GetCartInModalRecommendResponse';

type Props = {
	seriesCode: string;
	className?: string;
};

export const AddToCartRecommend: React.VFC<Props> = ({
	seriesCode,
	className,
}) => {
	const [recommend, setRecommend] =
		useState<GetCartInModalRecommendResponse | null>();

	const load = useCallback(async () => {
		try {
			setRecommend(
				await getCartInModalRecommend({
					seriesCode,
					dispPage: 'cart',
				})
			);
		} catch (error) {
			// Noop
		}
	}, [seriesCode]);

	useOnMounted(load);

	if (!recommend || recommend.recommendItems.length === 0) {
		return null;
	}

	return <Presenter recommend={recommend} className={className} />;
};
