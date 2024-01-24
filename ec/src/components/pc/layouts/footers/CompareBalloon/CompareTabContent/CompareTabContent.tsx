import { FC } from 'react';
import styles from '../CompareBalloon.module.scss';
import classNames from 'classnames';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { pagesPath } from '@/utils/$path';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { NagiLink } from '@/components/mobile/ui/links';

type Props = {
	compare: Compare;
	tabHeads: string[];
	tabContents: CompareItem[];
	activeCategoryCode: string | undefined;
	onClick: (categoryCode: string) => void;
};

export const CompareTabContent: FC<Props> = ({
	compare,
	tabHeads,
	tabContents,
	activeCategoryCode,
	onClick,
}) => {
	console.log('contents ====> ', tabContents);

	const getCategoryName = (categoryCode: string) => {
		return (
			compare.items.find(item => item.categoryCode === categoryCode)
				?.categoryName || ''
		);
	};

	const shorteningText = (text: string, length: number) => {
		if (text.length > length) {
			text = text.substring(0, length) + '...';
		}
		return text;
	};
	return (
		<div>
			<div className={styles.tabHead}>
				{tabHeads &&
					tabHeads.length > 0 &&
					tabHeads.map((categoryCode, index) => {
						return (
							<div
								key={categoryCode}
								className={classNames(
									styles.tabHeadItem,
									categoryCode === activeCategoryCode ? styles.on : ''
								)}
								onClick={() => onClick(categoryCode)}
							>
								<div className={styles.closeBtn}>닫기버튼</div>
								<p
									className={classNames(
										styles.name,
										styles.ndrBold,
										styles.ndrEllipsis
									)}
								>
									{getCategoryName(categoryCode)}
								</p>
							</div>
						);
					})}
			</div>
			<div className={styles.tabContentItem}>
				<div className={classNames(styles.pcpInfo, styles.ndrClearfix)}>
					<div className={styles.left}>
						<p>
							총 <span></span>건
						</p>
						<p>
							| <span></span>건 선택
						</p>
					</div>
					<div className={styles.right}>
						<p>삭제</p>
						<p>|</p>
						<p>
							<a>전체선택</a>
						</p>
					</div>
				</div>
				<div className={styles.pcpItemSection}>
					<div className={styles.pcpBlankItemWrap}>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
					</div>
					<ul>
						{tabContents && tabContents.length > 0 ? (
							tabContents.map((item, index) => {
								const seriesUrl = pagesPath.vona2.detail
									._seriesCode(item.seriesCode)
									.$url({ query: { HissuCode: item.partNumber } });

								return (
									<li className={styles.pcpItem} key={item.partNumber}>
										<div className={styles.pcpCloseBtn}></div>
										<div className={styles.pcpItemTitle}>
											<p className={styles.ndrBold}>
												{shorteningText(item.seriesName, 48)}
											</p>
										</div>
										<p
											className={classNames(styles.ndrEllipsis, styles.ndrThin)}
										>
											{item.brandName}
										</p>
										<div className={styles.pcpItemImg}>
											<ProductImage
												imageUrl={item.productImageUrl}
												preset="t_search_view_a"
												comment={item.seriesName}
												size={135}
											/>
										</div>
										<div
											className={classNames(
												styles.pcpModelName,
												styles.pcpNewWindow
											)}
										>
											<NagiLink href={seriesUrl}>
												<p className={styles.ndrThin}>{item.partNumber}</p>
											</NagiLink>
										</div>
									</li>
								);
							})
						) : (
							<p>데이터가 없습니다.</p>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

CompareTabContent.displayName = 'CompareTabContent';
