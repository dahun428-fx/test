import { useCallback, useState } from 'react';
import { AddToMyComponentsRecommend as Presenter } from './AddToMyComponentsRecommend';
import { getMyPartsListAddModalRecommend } from '@/api/services/cameleer/getMyPartsListAddModalRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetMyPartsListAddModalRecommendResponse } from '@/models/api/cameleer/getMyPartsListAddModalRecommend/GetMyPartsListAddModalRecommendResponse';

type Props = {
	seriesCode: string;
	className?: string;
};

export const AddToMyComponentsRecommend: React.VFC<Props> = ({
	seriesCode,
	className,
}) => {
	const [recommend, setRecommend] =
		useState<GetMyPartsListAddModalRecommendResponse | null>();

	const load = useCallback(async () => {
		try {
			setRecommend(
				await getMyPartsListAddModalRecommend({
					seriesCode,
					dispPage: 'mypage',
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
