import { useTranslation } from 'react-i18next';
import styles from './ProductDescription.module.scss';
import { CatchCopy } from '@/components/mobile/pages/ProductDetail/CatchCopy';
import { EleWysiwyg } from '@/components/mobile/pages/ProductDetail/EleWysiwyg';
import { SeriesInfoText } from '@/components/mobile/pages/ProductDetail/SeriesInfoText';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { TabType } from '@/models/api/msm/ect/series/shared';

type Props = {
	catchCopy?: string;
	seriesInfoText?: string[];
	productDescriptionHtml?: string;
	tabType: TabType;
	className?: string;
};

/**
 * Product description
 */
export const ProductDescription: React.VFC<Props> = ({
	catchCopy,
	seriesInfoText,
	productDescriptionHtml,
	tabType,
	className,
}) => {
	const { t } = useTranslation();

	return (
		<div className={className}>
			<SectionHeading>
				{t('mobile.pages.productDetail.productDescription.title')}
			</SectionHeading>
			<div className={styles.descriptionContainer}>
				<CatchCopy catchCopy={catchCopy} />
				<EleWysiwyg
					tabType={tabType}
					eleWysiwygDescriptionHtml={productDescriptionHtml}
				/>
				<SeriesInfoText seriesInfoText={seriesInfoText} />
			</div>
		</div>
	);
};
ProductDescription.displayName = 'ProductDescription';
