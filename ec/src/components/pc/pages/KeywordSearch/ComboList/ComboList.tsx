import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ComboList.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
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
	className?: string;
	comboResponse: SearchComboResponse;
	onClickLink?: (index: number, series: Series, partNumber: string) => void;
};

/**
 * COMBO list
 */
export const ComboList: React.VFC<Props> = ({
	className,
	keyword,
	comboResponse,
	onClickLink,
}) => {
	const { t } = useTranslation();

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
		<Section
			id="comboList"
			className={className}
			title={t('pages.keywordSearch.comboList.heading', { keyword })}
			disabledExpand
		>
			<ul className={styles.container}>
				{comboResponse.seriesList.map((item, index) => {
					return (
						<li key={index} className={styles.item}>
							<ProductImage
								imageUrl={item.productImageList[0]?.url}
								size={100}
								className={styles.image}
							/>
							<ul>
								<li className={styles.brandName}>{item.brandName}</li>
								<li dangerouslySetInnerHTML={{ __html: item.seriesName }} />
								<li>
									<ul>
										{item.partNumberList.map(({ partNumber }, itemIndex) => {
											return (
												<li key={partNumber} className={styles.partNumberItem}>
													<Link
														href={pagesPath.vona2.detail
															._seriesCode(item.seriesCode)
															.$url({
																query: {
																	searchFlow: 'combo2products',
																	KWSearch: keyword,
																	HissuCode: partNumber,
																	PNSearch: partNumber,
																	list: ItemListName.KEYWORD_SEARCH_RESULT,
																},
															})}
														onClick={() => {
															handleClick(
																item.seriesCode,
																item.brandCode,
																partNumber
															);
															onClickLink?.(itemIndex, item, partNumber);
														}}
														className={styles.partNumberLink}
													>
														{partNumber}
													</Link>
												</li>
											);
										})}
									</ul>
								</li>
								<li>
									<Link
										href={pagesPath.vona2.detail
											._seriesCode(item.seriesCode)
											.$url({
												query: {
													searchFlow: 'combo2products',
													KWSearch: keyword,
												},
											})}
										onClick={() => handleClick(item.seriesCode)}
										className={styles.candidatePartNumberLink}
									>
										{t('pages.keywordSearch.comboList.candidateLink')}
									</Link>
								</li>
							</ul>
						</li>
					);
				})}
			</ul>
		</Section>
	);
};
ComboList.displayName = 'ComboList';
