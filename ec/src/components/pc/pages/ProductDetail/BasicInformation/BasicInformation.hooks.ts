import { useSelector } from 'react-redux';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { getEleWysiwygHtml } from '@/utils/domain/series';

/** basic info. hook */
export const useBasicInfo = () => {
	const series = useSelector(selectSeries);

	const eleWysiwygHtml = getEleWysiwygHtml(series);

	const showsBasicInfo =
		!!series.catchCopy ||
		(series.seriesInfoText && series.seriesInfoText.length > 0) ||
		!!series.technicalInfoUrl ||
		!!eleWysiwygHtml;

	return {
		showsBasicInfo,
		eleWysiwygHtml,
		catchCopyHtml: series.catchCopy,
		seriesInfoText: series.seriesInfoText,
		technicalInfoUrl: series.technicalInfoUrl,
	};
};
