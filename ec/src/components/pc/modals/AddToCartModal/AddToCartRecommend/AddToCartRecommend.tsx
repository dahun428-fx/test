import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, {
	RefCallback,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddToCartRecommend.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { ModalContentContext } from '@/components/pc/ui/modals/context';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { config } from '@/config';
import { usePage } from '@/hooks/state/usePage';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import {
	GetCartInModalRecommendResponse,
	RecommendItem,
} from '@/models/api/cameleer/getCartInModalRecommend/GetCartInModalRecommendResponse';
import { assignListParam } from '@/utils/cameleer';
import { getHeight } from '@/utils/dom';
import { toNumeric } from '@/utils/string';

const PAGE_SIZE = 5;

type Props = {
	recommend: GetCartInModalRecommendResponse;
	className?: string;
};

export const AddToCartRecommend: React.VFC<Props> = ({
	recommend,
	className,
}) => {
	const [t] = useTranslation();
	const router = useRouter();
	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;
	const { close } = useContext(ModalContentContext);
	const allRecommends = useMemo(
		() => recommend.recommendItems.filter(item => item.linkUrl),
		[recommend.recommendItems]
	);

	const {
		listPerPage: recommendList,
		goToNext,
		backToPrev,
	} = usePage({
		initialPageSize: PAGE_SIZE,
		list: allRecommends,
	});

	const [minHeight, setMinHeight] = useState<number>();
	const listRef = useCallback<RefCallback<HTMLUListElement>>(listElement => {
		if (listElement) {
			setMinHeight(getHeight(listElement));
		}
	}, []);

	const handleClickRecommend = useCallback(
		(item: RecommendItem, event: React.MouseEvent) => {
			event.preventDefault();
			ga.ecommerce.selectItem({
				seriesCode: item.itemCd,
				itemListName: ItemListName.PURCHASE_RECOMMEND,
			});
			cameleer.trackClick({ ...recommend, item });
			close?.();

			if (item.linkUrl) {
				const path = assignListParam(
					item.linkUrl,
					ItemListName.PURCHASE_RECOMMEND
				);
				router.push(path);
			}
		},
		[close, recommend, router]
	);

	useEffect(() => {
		ga.ecommerce.viewItemList(
			recommendList.map(recommend => ({
				seriesCode: recommend.itemCd,
				itemListName: ItemListName.PURCHASE_RECOMMEND,
			}))
		);
	}, [recommendList]);

	return (
		<div className={classNames(styles.recommendContainer, className)}>
			<h4 className={styles.recommendTitle}>{recommend.title}</h4>
			<p className={styles.notice}>
				{t('components.modals.addToCartModal.addToCartModalRecommend.notice')}
			</p>
			<div className={styles.recommendListContainer}>
				<ul className={styles.list} ref={listRef} style={{ minHeight }}>
					{recommendList.map((item, index) => (
						<li key={index}>
							<Link
								href={assignListParam(
									item.linkUrl,
									ItemListName.PURCHASE_RECOMMEND
								)}
								className={styles.link}
								onClick={event => handleClickRecommend(item, event)}
							>
								<div className={styles.item}>
									<div className={styles.imageContainer}>
										<ProductImage
											imageUrl={item.imgUrl}
											className={styles.image}
											comment={item.name}
											size={100}
											onLoad={() =>
												cameleer.trackImpression({ ...recommend, item }).then()
											}
										/>
									</div>

									<p className={styles.brand}>{item.maker}</p>
									<p
										className={styles.name}
										dangerouslySetInnerHTML={{ __html: item.name ?? '' }}
									/>
									<p className={styles.price}>
										{t(
											'components.modals.addToCartModal.addToCartModalRecommend.unitPrice'
										)}
										<StandardPrice
											minStandardUnitPrice={toNumeric(item.priceFrom)}
											maxStandardUnitPrice={toNumeric(item.priceTo)}
											ccyCode={currencyCode}
											suffix="-"
										/>
									</p>
									<p className={styles.daysToShip}>
										{t(
											'components.modals.addToCartModal.addToCartModalRecommend.daysToShip'
										)}
										<CrmDaysToShip
											minDaysToShip={toNumeric(item.deliveryFrom)}
											maxDaysToShip={toNumeric(item.deliveryTo)}
										/>
									</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
				<div className={styles.previousButton} onClick={backToPrev} />
				<div className={styles.nextButton} onClick={goToNext} />
			</div>
		</div>
	);
};
AddToCartRecommend.displayName = 'AddToCartRecommend';
