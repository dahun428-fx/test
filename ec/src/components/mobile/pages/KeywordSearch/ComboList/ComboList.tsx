import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './ComboList.module.scss';
import { Section } from '@/components/mobile/pages/KeywordSearch/Section/Section';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Link } from '@/components/mobile/ui/links';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import {
	SearchComboResponse,
	Series,
} from '@/models/api/msm/ect/combo/SearchComboResponse';
import { pagesPath } from '@/utils/$path';

type Props = {
	keyword: string;
	comboResponse: SearchComboResponse;
	onClickLink?: (index: number, series: Series, partNumber: string) => void;
};

/**
 * Combo list
 */
export const ComboList: React.VFC<Props> = ({
	keyword,
	comboResponse,
	onClickLink,
}) => {
	const [t] = useTranslation();

	const handleClick = (
		seriesCode: string,
		brandCode?: string,
		partNumber?: string
	) => {
		ga.ecommerce.selectItem({
			seriesCode: seriesCode,
			itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
		});
		aa.events.sendClickCombo({
			brandCode,
			seriesCode,
			partNumber,
		});
	};

	return (
		<div>
			<p className={styles.comboText}>
				<Trans
					i18nKey="mobile.pages.keywordSearch.comboList.keywordNotMatch"
					values={{ keyword }}
				>
					<strong />
				</Trans>
			</p>

			<Section heading={t('mobile.pages.keywordSearch.comboList.heading')}>
				<div className={styles.list}>
					{comboResponse.seriesList.map(series => (
						<div className={styles.item} key={series.seriesCode}>
							<div className={styles.productImage}>
								<ProductImage
									imageUrl={series.productImageList[0]?.url}
									comment={series.seriesName}
									size={90}
								/>
							</div>
							<div>
								<p
									className={styles.seriesName}
									dangerouslySetInnerHTML={{ __html: series.seriesName }}
								/>
								<p className={styles.brandName}>{series.brandName}</p>
								<ul className={styles.partNumberList}>
									{series.partNumberList.map(({ partNumber }, itemIndex) => (
										<li key={partNumber}>
											<Link
												href={pagesPath.vona2.detail
													._seriesCode(series.seriesCode)
													.$url({
														query: {
															searchFlow: 'combo2products',
															HissuCode: partNumber,
														},
													})}
												onClick={() => {
													handleClick(
														series.seriesCode,
														series.brandCode,
														partNumber
													);
													onClickLink?.(itemIndex, series, partNumber);
												}}
												className={styles.partNumberLink}
											>
												{partNumber}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			</Section>
		</div>
	);
};
ComboList.displayName = 'ComboList';
