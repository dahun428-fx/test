import classNames from 'classnames';
import NextLink from 'next/link';
import {
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	VFC,
} from 'react';
import { useTranslation } from 'react-i18next';
import sanitizeHtml from 'sanitize-html';
import { UrlObject } from 'url';
import styles from './ListItem.module.scss';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { SeriesLabels } from '@/components/pc/domain/category/SeriesList/SeriesLabels';
import { SpecTable } from '@/components/pc/domain/category/SeriesList/SpecTable';
import { PriceLeadTime } from '@/components/pc/domain/series/PriceLeadTime';
import { SeriesDiscount } from '@/components/pc/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { EconomyLabel } from '@/components/pc/ui/labels';
import { Link } from '@/components/pc/ui/links/Link';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { Spec } from '@/models/api/msm/ect/series/shared';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	image: {
		url: string;
		comment?: string;
	};
	series: Series;
	currencyCode?: string;
	isCValueProduct: boolean;
	specList: Spec[];
	seriesUrl: string;
	linkUrlForCadType: (cadType?: string) => UrlObject;
	onClick: (event: MouseEvent) => void;
};

/** List item component */
export const ListItem: VFC<Props> = ({
	image,
	series,
	currencyCode,
	isCValueProduct,
	specList,
	seriesUrl,
	linkUrlForCadType,
	onClick,
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

	const catchCopy = useMemo(() => {
		if (!series.catchCopy) {
			return '';
		}

		try {
			const cleanedCatchCopy = sanitizeHtml(series.catchCopy, {
				allowedTags: ['a'], // Remove all HTML tags
				allowedAttributes: {},
			});

			return cleanedCatchCopy;
		} catch {
			return '';
		}
	}, [series.catchCopy]);

	const onResize = useCallback(() => {
		if (catchCopyRef.current && catchCopyBoxRef.current) {
			setCatchCopyOverflow(
				catchCopyRef.current.scrollHeight > catchCopyBoxRef.current.clientHeight
			);
		}
	}, []);

	const handleClickReadMore = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			setReadMore(true);
			window.removeEventListener('resize', onResize);
		},
		[onResize]
	);

	useEffect(() => {
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [onResize]);

	return (
		<li className={styles.tile} onClick={onClick}>
			<div className={styles.main}>
				<div className={styles.panel}>
					<div className={styles.imageSide}>
						<div className={styles.imgBox}>
							<ProductImage
								imageUrl={image.url}
								comment={image.comment}
								preset="t_product_view_b"
								size={150}
							/>
						</div>
					</div>
					<div className={styles.textSide}>
						<SeriesLabels
							recommendFlag={series.recommendFlag}
							gradeTypeDisp={series.gradeTypeDisp}
							campaignEndDate={series.campaignEndDate}
							iconTypeList={series.iconTypeList}
							pictList={series.pictList}
						/>
						<div className={styles.brandWrapper}>
							<p className={styles.brandItem}>{series.brandName}</p>
							{isCValueProduct && (
								<>
									<EconomyLabel className={styles.brandItem} />
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
						{catchCopy && (
							<div
								ref={catchCopyBoxRef}
								className={classNames(styles.catchCopyBox, {
									[String(styles.readMoreCatchCopy)]: readMore,
								})}
							>
								<LegacyStyledHtml
									html={catchCopy}
									className={styles.catchCopyText}
									ref={catchCopyRef}
								/>
								<div
									className={classNames(styles.readMoreButton, {
										[String(styles.none)]: !catchCopyOverflow || readMore,
									})}
									onClick={event => handleClickReadMore(event)}
								>
									{t(
										'components.domain.category.seriesList.seriesTile.readMore'
									)}
								</div>
							</div>
						)}
						{series.cadTypeList.length > 0 && (
							<dl className={styles.cadLinkList}>
								<dt className={styles.cadLabel}>
									{t(
										'components.domain.category.seriesList.seriesTile.cadLabel'
									)}
								</dt>
								{series.cadTypeList.map((cadType, index) => (
									<dd className={styles.cadType} key={index}>
										{index > 0 && (
											<span className={styles.cadLinkSeparator}>{`/`}</span>
										)}
										<Link
											href={linkUrlForCadType(cadType.cadType)}
											target="_blank"
										>
											{cadType.cadTypeDisp}
										</Link>
									</dd>
								))}
							</dl>
						)}
						<div className={styles.specTableWrapper}>
							{specList.length > 0 && (
								<SpecTable
									specList={specList}
									comparisonSpecValueList={series.comparisonSpecValueList}
								/>
							)}
						</div>
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
