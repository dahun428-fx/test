import { FC } from 'react';
import styles from '../CompareBalloon.module.scss';
import classNames from 'classnames';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { pagesPath } from '@/utils/$path';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { NagiLink } from '@/components/mobile/ui/links';
import { useTranslation } from 'react-i18next';
import { BlockLoader } from '@/components/pc/ui/loaders';

type Props = {
	compare: Compare;
	tabHeads: string[];
	tabContents: CompareItem[];
	activeCategoryCode: string | undefined;
	totalCount: number;
	selectedCount: number;
	selectedItems: Set<CompareItem>;
	loading: boolean;
	handlePartNumberClick: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => void;
	handleTabClick: (categoryCode: string) => void;
	handleTabDelete: () => void;
	handleSelectItem: (compareItem: CompareItem) => void;
	handleDeleteItem: (compareITem: CompareItem) => void;
	handleSelectAllItem: () => void;
	handleDeleteAllItem: () => void;
};

export const CompareTabContent: FC<Props> = ({
	compare,
	tabHeads,
	loading,
	tabContents,
	activeCategoryCode,
	totalCount,
	selectedCount,
	selectedItems,
	handlePartNumberClick,
	handleTabClick,
	handleTabDelete,
	handleSelectItem,
	handleDeleteItem,
	handleSelectAllItem,
	handleDeleteAllItem,
}) => {
	const [t] = useTranslation();

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

	const isSelected = (compareItem: CompareItem) => {
		return Array.from(selectedItems).some(
			item =>
				item.seriesCode === compareItem.seriesCode &&
				item.partNumber === compareItem.partNumber
		);
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
								onClick={() => handleTabClick(categoryCode)}
							>
								<div
									className={styles.closeBtn}
									onClick={handleTabDelete}
								></div>
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
							{t('components.ui.layouts.footers.compareBalloon.totalCount', {
								totalCount: totalCount,
							})}
						</p>

						{tabContents.length > 0 && (
							<p>
								{t('components.ui.layouts.footers.compareBalloon.totalSelect', {
									totalSelect: selectedCount,
								})}
							</p>
						)}
					</div>
					<div className={styles.right}>
						<p>
							<a onClick={handleDeleteAllItem}>
								{t('components.ui.layouts.footers.compareBalloon.delete')}
							</a>
						</p>
						<p>|</p>
						<p>
							<a onClick={handleSelectAllItem}>
								{t('components.ui.layouts.footers.compareBalloon.selectAll')}
							</a>
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
					{loading ? (
						<BlockLoader />
					) : (
						<ul>
							{tabContents &&
								tabContents.length > 0 &&
								tabContents.map((item, index) => {
									const seriesUrl = pagesPath.vona2.detail
										._seriesCode(item.seriesCode)
										.$url({ query: { HissuCode: item.partNumber } });

									return (
										<li
											className={classNames(
												styles.pcpItem,
												isSelected(item) ? styles.on : ''
											)}
											key={item.partNumber}
											onClick={() => handleSelectItem(item)}
										>
											<div
												className={styles.pcpCloseBtn}
												onClick={() => handleDeleteItem(item)}
											></div>
											<div className={styles.pcpItemTitle}>
												<p className={styles.ndrBold}>
													{shorteningText(item.seriesName, 48)}
												</p>
											</div>
											<p
												className={classNames(
													styles.ndrEllipsis,
													styles.ndrThin
												)}
											>
												{item.brandName}
											</p>
											<div className={styles.pcpItemImg}>
												<ProductImage
													imageUrl={item.productImageUrl}
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
												<NagiLink
													href={seriesUrl}
													onClick={e => handlePartNumberClick(e)}
												>
													<p className={styles.ndrThin}>{item.partNumber}</p>
												</NagiLink>
											</div>
										</li>
									);
								})}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

CompareTabContent.displayName = 'CompareTabContent';
