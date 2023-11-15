import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductBaseCell.module.scss';
import { SeriesLabels } from '@/components/pc/domain/series/SeriesLabels';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Label } from '@/components/pc/ui/labels';
import { Link } from '@/components/pc/ui/links';
import { IconType } from '@/models/api/constants/IconType';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { url } from '@/utils/url';

type Props = {
	type: Series;
};

export const ProductBaseCell = memo<Props>(({ type }) => {
	const { t } = useTranslation();
	const [image] = type.productImageList;

	return (
		<td className={styles.dataCell}>
			<div className={styles.inner}>
				<ProductImage
					imageUrl={image?.url}
					preset="t_search_view_a"
					comment={type.seriesName}
					size={50}
				/>
				<div className={styles.attributes}>
					{type.seriesStatus === SeriesStatus.DISCONTINUED && (
						<p>
							<Label theme="disabled">
								{t('pages.keywordSearch.partNumberTypeList.discontinuedLabel')}
							</Label>
						</p>
					)}
					{type.seriesStatus === SeriesStatus.UNLISTED && (
						<p>
							<Label>
								{t('pages.keywordSearch.partNumberTypeList.unlistedLabel')}
							</Label>
						</p>
					)}
					{/* 価格改定、値下げ、納期短縮アイコンのみ表示 */}
					<SeriesLabels
						campaignEndDate={type.campaignEndDate}
						iconTypeList={type.iconTypeList}
						displayIconTypes={[
							IconType.PRICE_CHANGE,
							IconType.PRICE_DOWN,
							IconType.SHORT_DELIVERY,
						]}
					/>
					<p className={styles.partNumber}>
						{type.seriesStatus === SeriesStatus.NORMAL ? (
							<Link
								href={url
									.productDetail(type.seriesCode)
									.fromKeywordSearch(type.partNumber)
									.typeList(type.partNumber)}
								target="_blank"
								onClick={event => event.preventDefault()}
							>
								{type.partNumber}
							</Link>
						) : (
							type.partNumber
						)}
					</p>
					<p dangerouslySetInnerHTML={{ __html: type.seriesName }} />
					<p>{type.brandName}</p>
				</div>
			</div>
		</td>
	);
});
ProductBaseCell.displayName = 'ProductBaseCell';
