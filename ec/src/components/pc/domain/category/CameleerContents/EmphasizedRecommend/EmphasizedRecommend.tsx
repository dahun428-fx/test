import classNames from 'classnames';
import Image from 'next/image';
import React, {
	FC,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EmphasizedRecommend.module.scss';
import { GetGeneralRecommendParam } from '@/api/services/cameleer/getGeneralRecommend';
import truckImage from '@/assets/pc/images/icons/truck.svg';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links/Link';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import type { GeneralRecommendLogParams } from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

type Props = {
	dispPage: GeneralRecommendLogParams['dispPage'];
	recommendCode: GetGeneralRecommendParam['recommendCd'];
	listPerPage: GeneralRecommendSeriesItem[];
	totalPageCount: number;
	onClickItem: (category: GeneralRecommendSeriesItem) => void;
	onLoadItem: (category: GeneralRecommendSeriesItem) => void;
	onPagingCarousel: (page: -1 | 1) => void;
	onUpdateViewableItemNumber: (viewableItemNumber: number) => void;
};

/** Purchase recommend products section */
export const EmphasizedRecommend: FC<Props> = ({
	dispPage,
	recommendCode,
	listPerPage,
	totalPageCount,
	onLoadItem,
	onClickItem,
	onPagingCarousel,
	onUpdateViewableItemNumber,
}) => {
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	const onClickPrev = useCallback(
		() => onPagingCarousel(-1),
		[onPagingCarousel]
	);
	const onClickNext = useCallback(
		() => onPagingCarousel(1),
		[onPagingCarousel]
	);

	// マウント時やウィンドウサイズ変更時に表示件数を算出/更新する
	const updateViewableItemNumber = useCallback(() => {
		const viewableItemNumber =
			containerRef.current && listRef.current?.children[0]
				? containerRef.current?.clientWidth /
				  listRef.current?.children[0].clientWidth
				: 0;

		// 小数点を切り捨て, 不要な再レンダリングを防ぐ
		onUpdateViewableItemNumber(Math.floor(viewableItemNumber));
	}, [onUpdateViewableItemNumber]);

	useEffect(() => {
		updateViewableItemNumber();
	}, [updateViewableItemNumber]);

	useLayoutEffect(() => {
		window.addEventListener('resize', updateViewableItemNumber);
		return () => window.removeEventListener('resize', updateViewableItemNumber);
	}, [updateViewableItemNumber]);

	// カルーセルで見えてるリスト
	const viewableList = useMemo(
		() =>
			listPerPage.map((item, index) => (
				<li
					key={`${item.seriesCode}-${index}`}
					className={styles.item}
					onClick={() => onClickItem(item)}
				>
					<div className={styles.imageWrapper}>
						<ProductImage
							imageUrl={item.imgUrl}
							comment={item.seriesName}
							size={100}
							onLoad={() => onLoadItem(item)}
							className={styles.image}
						/>
					</div>
					<Link
						href={`${item.linkUrl}?rid=${recommendCode}_${dispPage}_${item.position}_${item.seriesCode}`}
						className={styles.itemName}
						onClick={e => e.preventDefault()}
					>
						{item.seriesName}
					</Link>
					<p>{item.brandName}</p>
					<p className={styles.price}>
						{`${t(
							'components.domain.category.cameleerContents.emphasizedRecommend.price'
						)}: `}
						<StandardPrice
							minStandardUnitPrice={Number(item.minStandardUnitPrice)}
							maxStandardUnitPrice={Number(item.maxStandardUnitPrice)}
							ccyCode={item.currencyCode}
						/>
					</p>

					<p className={styles.daysToShip}>
						<Image src={truckImage} width={24} height={24} alt="days to ship" />
						<span>&nbsp;</span>
						<DaysToShip
							minDaysToShip={Number(item.minStandardDaysToShip)}
							maxDaysToShip={Number(item.maxStandardDaysToShip)}
						/>
					</p>
				</li>
			)),
		[listPerPage, recommendCode, dispPage, t, onClickItem, onLoadItem]
	);

	return (
		<div className={styles.container} ref={containerRef}>
			<h2 className={styles.header}>
				{t(
					`components.domain.category.cameleerContents.emphasizedRecommend.title.${
						recommendCode === 'c24-allusers'
							? 'complementaryProducts'
							: 'justForYou'
					}`
				)}
			</h2>

			<div className={styles.carousel}>
				<ul className={styles.list} ref={listRef}>
					{viewableList}
				</ul>
				{totalPageCount > 1 && (
					<>
						<button
							aria-label="back"
							className={classNames(styles.button, styles.buttonLeft)}
							onClick={onClickPrev}
						/>
						<button
							aria-label="next"
							className={classNames(styles.button, styles.buttonRight)}
							onClick={onClickNext}
						/>
					</>
				)}
			</div>
		</div>
	);
};

EmphasizedRecommend.displayName = 'EmphasizedRecommend';
