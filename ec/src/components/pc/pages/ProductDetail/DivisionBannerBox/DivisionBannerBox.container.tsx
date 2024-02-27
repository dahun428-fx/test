import { useSelector } from '@/store/hooks';
import { DivisionBannerBox as Presenter } from './DivisionBannerBox';
import {
	selectSeries,
	selectTemplateType,
	selectUnitLibraryResponse,
} from '@/store/modules/pages/productDetail';
import { useMemo, useState } from 'react';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { getPromotionBanner } from '@/api/services/legacy/htmlContents/detail/getPromotionBanner';

export const DivisionBannerBox: React.VFC = () => {
	const unitLibraryResponse = useSelector(selectUnitLibraryResponse);
	const templateType = useSelector(selectTemplateType);
	const seriesResponse = useSelector(selectSeries);

	const [seriesHtmlReponse, setSeriesHtmlReponse] = useState<string>();
	const [categoryHtmlReponse, setCategoryHtmlReponse] = useState<string>();
	const [bnrBHtmlReponse, setBnrBHtmlReponse] = useState<string>();

	const isRightBanner = templateType === TemplateType.PU;

	useMemo(async () => {
		if (isRightBanner) {
			return;
		}

		try {
			const seriesHtmlReponse = await getPromotionBanner(
				seriesResponse.seriesCode
			);
			setSeriesHtmlReponse(seriesHtmlReponse);
		} catch {}

		try {
			const categoryHtmlReponse = seriesResponse.categoryCode
				? await getPromotionBanner(seriesResponse.categoryCode)
				: undefined;
			setCategoryHtmlReponse(categoryHtmlReponse);
		} catch {}

		if (!unitLibraryResponse?.unitLibraryList.length) {
			try {
				const bnrBHtmlReponse = await getPromotionBanner(
					seriesResponse.seriesCode,
					true
				);
				setBnrBHtmlReponse(bnrBHtmlReponse);
			} catch {}
		}
	}, [
		isRightBanner,
		seriesResponse.categoryCode,
		seriesResponse.seriesCode,
		unitLibraryResponse?.unitLibraryList.length,
	]);

	return (
		<Presenter
			isRightBanner={isRightBanner}
			seriesCode={seriesResponse.seriesCode}
			unitLibraryList={unitLibraryResponse?.unitLibraryList ?? []}
			seriesHtmlReponse={seriesHtmlReponse}
			categoryHtmlReponse={categoryHtmlReponse}
			bnrBHtmlReponse={bnrBHtmlReponse}
		/>
	);
};

DivisionBannerBox.displayName = 'DivisionBannerBox';
