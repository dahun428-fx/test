import classNames from 'classnames';
import NextLink from 'next/link';
import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	useMemo,
	MouseEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';
import styles from './ListItem.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { PriceLeadTime } from '@/components/pc/domain/series/PriceLeadTime';
import { SeriesDiscount } from '@/components/pc/domain/series/SeriesDiscount';
import { SeriesLabels } from '@/components/pc/domain/series/SeriesLabels';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { EconomyLabel } from '@/components/pc/ui/labels';
import { Link } from '@/components/pc/ui/links/Link';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getSeriesNameDisp } from '@/utils/domain/series';

export type CategoryLinkData = {
	categoryName: string;
	categoryUrl: string;
};

type Props = {
	image: {
		url: string;
		comment?: string;
	};
	series: Series;
	currencyCode?: string;
	isCValueProduct: boolean;
	seriesUrl: string;
	linkUrlForCadType: (cadType?: string) => UrlObject;
	onClick: (event: MouseEvent) => void;
	onClickBreadcrumb: (categoryUrl: string) => void;
};

/** List item component */
export const ListItem: React.VFC<Props> = ({
	image,
	series,
	currencyCode,
	isCValueProduct,
	seriesUrl,
	linkUrlForCadType,
	onClick,
	onClickBreadcrumb,
}) => {
	const [t] = useTranslation();
	const catchCopyRef = useRef<HTMLDivElement>(null);
	const catchCopyBoxRef = useRef<HTMLDivElement>(null);

	/** read more button is clicked or not */
	const [readMore, setReadMore] = useState(false);

	/** catch copy is more than 3 lines or not */
	const [catchCopyOverflow, setCatchCopyOverflow] = useState(false);

	const seriesName = useMemo(() => {
		if (Flag.isTrue(series.packageSpecFlag)) {
			return series.seriesName;
		}

		return getSeriesNameDisp(series, t);
	}, [series, t]);

	const categoryList = useMemo(() => {
		if (
			series.templateType === TemplateType.PATTERN_H ||
			series.categoryList.length === 0
		) {
			return [];
		}
		const list: CategoryLinkData[] = [];

		series.categoryList.forEach((category, index) => {
			const parentCategory = index >= 1 ? list[index - 1] : undefined;
			const parentUrl = !parentCategory ? '/vona2' : parentCategory.categoryUrl; // こんなロジックやめたい
			list.push({
				categoryName: category.categoryName,
				categoryUrl: `${parentUrl}/${category.categoryCode}`,
			});
		});

		if (series.categoryName && series.categoryCode) {
			list.push({
				categoryName: series.categoryName,
				categoryUrl: `${list[list.length - 1]?.categoryUrl}/${
					series.categoryCode
				}`,
			});
		}

		return list;
	}, [
		series.categoryCode,
		series.categoryList,
		series.categoryName,
		series.templateType,
	]);

	const adjustCatchCopyOverflow = useCallback(() => {
		if (catchCopyRef.current && catchCopyBoxRef.current) {
			setCatchCopyOverflow(
				catchCopyRef.current.scrollHeight > catchCopyBoxRef.current.clientHeight
			);
		}
	}, []);

	const handleClickReadMore = (event: React.MouseEvent) => {
		event.stopPropagation();
		setReadMore(true);
		window.removeEventListener('resize', adjustCatchCopyOverflow);
	};

	const handleClickBreadcrumb = (
		event: React.MouseEvent,
		categoryUrl: string
	) => {
		event.stopPropagation();
		onClickBreadcrumb(categoryUrl);
	};

	useEffect(() => {
		window.addEventListener('resize', adjustCatchCopyOverflow);
		return () => window.removeEventListener('resize', adjustCatchCopyOverflow);
	}, [adjustCatchCopyOverflow]);

	useOnMounted(() => {
		adjustCatchCopyOverflow();
	});

	return (
		<li className={styles.tile} onClick={onClick}>
			<div className={styles.main}>
				<div className={styles.panel}>
					<div className={styles.imageSide}>
						<div className={styles.imgBox}>
							<ProductImage
								imageUrl={image.url}
								comment={image.comment}
								preset="t_search_view_a"
								size={150}
							/>
						</div>
					</div>
					<div className={styles.textSide}>
						<SeriesLabels
							campaignEndDate={series.campaignEndDate}
							iconTypeList={series.iconTypeList}
							pictList={series.pictList}
						/>
						<div className={styles.brandWrapper}>
							<p className={styles.inlineItem}>{series.brandName}</p>
							{isCValueProduct && (
								<>
									<EconomyLabel className={styles.inlineItem} />
									<SeriesDiscount pictList={series.pictList} />
								</>
							)}
						</div>
						<p className={styles.seriesName}>
							<NextLink href={seriesUrl}>
								<a className={styles.seriesNameLink} target="_blank">
									<span dangerouslySetInnerHTML={{ __html: seriesName }} />
								</a>
							</NextLink>
						</p>
						{series.catchCopy && (
							<div
								ref={catchCopyBoxRef}
								className={classNames(styles.catchCopyBox, {
									[String(styles.readMoreCatchCopy)]: readMore,
								})}
							>
								<LegacyStyledHtml
									html={series.catchCopy}
									className={styles.catchCopyText}
									ref={catchCopyRef}
								/>
								<div
									className={
										catchCopyOverflow && !readMore
											? styles.readMoreButton
											: styles.none
									}
									onClick={event => handleClickReadMore(event)}
								>
									{t('pages.keywordSearch.seriesList.seriesTile.readMore')}
								</div>
							</div>
						)}
						{series.cadTypeList.length > 0 && (
							<dl className={styles.cadLinkList}>
								<dt className={styles.cadLabel}>
									{t('pages.keywordSearch.seriesList.seriesTile.cadLabel')}
								</dt>
								{series.cadTypeList.map((cadType, index) => (
									<dd className={styles.cadType} key={index}>
										{index > 0 && (
											<span className={styles.cadLinkSeparator}>{`/`}</span>
										)}
										<Link
											href={linkUrlForCadType(cadType.cadType)}
											target="_blank"
											onClick={event => {
												event.stopPropagation();
												ga.ecommerce.selectItem({
													...series,
													itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
												});
											}}
										>
											{cadType.cadTypeDisp}
										</Link>
									</dd>
								))}
							</dl>
						)}
						{categoryList.length > 0 && (
							<ul className={styles.categoryLinkList}>
								{categoryList.map((category, index) => (
									<li className={styles.categoryLinkItem} key={index}>
										{index !== 0 && (
											<span
												className={styles.categoryLinkSeparator}
											>{`>`}</span>
										)}
										{/* TODO: pagesPath */}
										<Link
											href={category.categoryUrl}
											className={styles.categoryLink}
											onClick={event =>
												handleClickBreadcrumb(event, category.categoryUrl)
											}
										>
											{category.categoryName}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
			<div className={styles.priceLeadTime}>
				<PriceLeadTime series={series} currencyCode={currencyCode} />
			</div>
		</li>
	);
};
ListItem.displayName = 'ListItem';
