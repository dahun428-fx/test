import classNames from 'classnames';
import React, { MouseEvent, RefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductAttributes } from './ProductAttributes.hooks';
import styles from './ProductAttributes.module.scss';
import { CatchCopy } from '@/components/pc/pages/ProductDetail/CatchCopy';
import { FaqLink } from '@/components/pc/pages/ProductDetail/Faq';
import { ProductAttributesLabels } from '@/components/pc/pages/ProductDetail/ProductAttributesLabels';
import { scrollToTab } from '@/components/pc/pages/ProductDetail/templates/Complex/Complex.utils';
import { Price } from '@/components/pc/ui/text/Price';
import { getEleWysiwygHtml } from '@/utils/domain/series';
import { notEmpty } from '@/utils/predicate';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { selectTemplateType } from '@/store/modules/pages/productDetail';
import { useSelector } from '@/store/hooks';
import { BrandCategory } from '@/components/pc/pages/ProductDetail/BrandCategory';
import { EconomyLabel } from '@/components/pc/pages/ProductDetail/EconomyLabel';
import { SeriesDiscount } from '@/components/pc/pages/ProductDetail/SeriesDiscount';
import { BasicInformation } from '@/components/pc/pages/ProductDetail/BasicInformation';

export type BasicInfoType = {
	basicInfoType?: 'full' | 'summary';
};

export type Props = {
	showsDetailInfoLink?: boolean;
	faqRef: RefObject<HTMLDivElement>;
	className?: string;
} & BasicInfoType;

/**
 * Product attributes on Product Detail
 */
export const ProductAttributes: React.VFC<Props> = ({
	faqRef,
	className,
	basicInfoType = 'summary',
}) => {
	const [t] = useTranslation();
	const { series, faqCount = 0, priceInfo } = useProductAttributes();
	const templateType = useSelector(selectTemplateType);

	const hasFaqCount = useMemo(() => {
		return faqCount >= 1;
	}, [faqCount]);

	if (!series) {
		return null;
	}

	const showsBasicInformation =
		series.catchCopy != null ||
		notEmpty(series.seriesInfoText) ||
		series.technicalInfoUrl != null ||
		getEleWysiwygHtml(series) != null;

	const handleDetailInfoLink = (e: MouseEvent) => {
		e.preventDefault();
		scrollToTab('detailInfo');
	};

	const hasCampaignPrice =
		!!priceInfo.campaignEndDate || !!priceInfo.minCampaignUnitPrice;

	const priceListWrapperStyle = hasFaqCount
		? classNames(styles.priceListWrapper, styles.priceListWrapperBorder)
		: styles.priceListWrapper;

	return (
		<div className={classNames(styles.container, className)}>
			<div>
				<ProductAttributesLabels
					iconTypeList={series.iconTypeList}
					discontinuedProductFlag={series.discontinuedProductFlag}
					campaignEndDate={series.campaignEndDate}
					gradeTypeDisp={series.gradeTypeDisp}
					minStandardDaysToShip={series.minStandardDaysToShip}
					minShortestDaysToShip={series.minShortestDaysToShip}
					maxStandardDaysToShip={series.maxStandardDaysToShip}
				/>

				<div className={styles.containerNavigation}>
					<FaqLink faqCount={faqCount} faqRef={faqRef} />
				</div>
				{templateType === TemplateType.PU && (
					<div className={styles.brandWrap}>
						<BrandCategory />
						<EconomyLabel className={styles.economy} />
						<SeriesDiscount />
					</div>
				)}
				<div
					className={classNames([
						priceListWrapperStyle,
						// catchCopy、detailInfo エリアがあるときだけ下線表示
						{
							[String(styles.priceListWrapperBorderBottom)]:
								showsBasicInformation,
						},
					])}
				>
					<div className={styles.priceListInner}>
						<label className={styles.unitPriceExcludeTaxLabel}>
							{t('pages.productDetail.productAttributes.unitPriceWithRange')}
						</label>
						{((hasCampaignPrice && priceInfo.minStandardUnitPrice) ||
							!hasCampaignPrice) && (
							<Price
								value={priceInfo.minStandardUnitPrice}
								ccyCode={priceInfo.currencyCode}
								emptySentence="-"
								theme="accent"
								strike={hasCampaignPrice}
							/>
						)}
						{hasCampaignPrice &&
							(priceInfo.minCampaignUnitPrice ? (
								<span className={styles.specialPrice}>
									<Price
										value={priceInfo.minCampaignUnitPrice}
										ccyCode={priceInfo.currencyCode}
										theme="medium-accent"
										isRed
									/>
								</span>
							) : (
								<span className={styles.specialPrice}>
									{t('pages.productDetail.productAttributes.specialPrice')}
								</span>
							))}
					</div>
					{basicInfoType === 'full' && (
						<BasicInformation
							showHeadings={false}
							templateType={templateType}
						/>
					)}
				</div>

				{showsBasicInformation && basicInfoType === 'summary' && (
					<div className={styles.catchCopyDetailInfo}>
						{!!series.catchCopy && (
							<CatchCopy catchCopy={series.catchCopy} catchCopyLength={39} />
						)}
						{showsBasicInformation && (
							<a
								onClick={event => handleDetailInfoLink(event)}
								href="#detailInfo"
								className={styles.link}
							>
								{t('pages.productDetail.productAttributes.confirmDetailInfo')}
							</a>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
ProductAttributes.displayName = 'ProductAttributes';
