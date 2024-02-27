import React, { FC, useCallback, useState } from 'react';
import { Banner as Presenter } from './Banner';
import { getBannerContent } from '@/api/services/legacy/htmlContents/detail/getBannerContents';
import { searchBanner } from '@/api/services/searchBanner';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { BannerType } from '@/utils/domain/banner';

type Props = {
	bannerType: BannerType;
	seriesCode: string;
};

/** Banner container component */
export const Banner: FC<Props> = ({ bannerType, seriesCode }) => {
	const [bannerContent, setBannerContent] = useState<string>();

	const getBanner = useCallback(async () => {
		try {
			const bannerResponse = await searchBanner({ bannerType, seriesCode });
			const currentBanner = bannerResponse.bannerList?.find(
				banner => banner.bannerType === bannerType
			);

			if (!currentBanner?.bannerPath) {
				return;
			}

			const bannerContentResponse = await getBannerContent(
				currentBanner.bannerPath
			);

			setBannerContent(bannerContentResponse);
		} catch (error) {
			// noop
		}
	}, [bannerType, seriesCode]);

	useOnMounted(getBanner);

	if (!bannerContent) {
		return null;
	}

	return <Presenter bannerContent={bannerContent} />;
};
Banner.displayName = 'Banner';
