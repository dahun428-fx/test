import { CompareDetail, SpecList } from '@/store/modules/pages/compareDetail';
import styles from './CompareDetail.module.scss';
import { Meta } from './Meta';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import classNames from 'classnames';
import { Button } from '../../ui/buttons';
import { useTranslation } from 'react-i18next';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { CompareDetailTable } from './CompareDetailTable';
import { useCallback, useState } from 'react';

type Props = {
	status: boolean;
	specList: SpecList[];
	totalCount: number;
	categoryName: string;
	currencyCode: string;
	compareDetailItems: CompareDetail[];
	selectedCompareDetailItems: Set<number>;
	searchSpecValue: (
		partNumber: PartNumber | undefined,
		specCode: string | undefined
	) => string;
	handleSelectItem: (idx: number) => void;
	handleSelectAllItem: () => void;
	handleDeleteItem: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		idx: number
	) => void;
	handleDeleteAllItem: () => void;
};
export const CompareDetailPage: React.FC<Props> = ({
	status,
	specList,
	totalCount,
	categoryName,
	currencyCode,
	selectedCompareDetailItems,
	compareDetailItems,
	searchSpecValue,
	handleSelectItem,
	handleSelectAllItem,
	handleDeleteItem,
	handleDeleteAllItem,
}) => {
	const [t] = useTranslation();

	return (
		<>
			<Meta />
			<div className={styles.page}>
				<div className={styles.breadcrumbWrap}>
					<Breadcrumbs
						breadcrumbList={[{ text: t('pages.compareDetail.breadcrumbText') }]}
					/>
				</div>
				<div className={styles.main}>
					<div>
						<div>
							<h1 className={styles.heading}>
								{t('pages.compareDetail.title', {
									categoryName: categoryName,
								})}
							</h1>
						</div>
						{status && (
							<div className={styles.productList}>
								<div
									className={classNames(
										styles.compareResult,
										styles.ndrClearfix
									)}
								>
									<div className={styles.topBtnSection}>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="order-now"
										>
											{t('components.ui.layouts.footers.compareBalloon.order')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="cart"
										>
											{t('components.ui.layouts.footers.compareBalloon.cart')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="default"
											icon="add-my-component"
										>
											{t(
												'components.ui.layouts.footers.compareBalloon.myComponent'
											)}
										</Button>
									</div>
									<div className={styles.productListBody}>
										<div
											className={classNames(
												styles.mainSection,
												styles.ndrClearfix
											)}
										>
											<div
												className={classNames(
													styles.compareInfo,
													styles.ndrClearfix
												)}
											>
												<p className={styles.total}>
													{t('pages.compareDetail.totalCount', {
														totalCount: totalCount,
													})}
												</p>
												<p className={styles.totalSelect}>
													{t('pages.compareDetail.totalSelect', {
														totalSelect: 0,
													})}
												</p>
											</div>
											<div className={styles.right}>
												<p
													className={classNames(styles.ndrBlue, styles.ndrBold)}
												>
													<a onClick={handleDeleteAllItem}>
														{t('pages.compareDetail.delete')}
													</a>
												</p>
												<p>|</p>
												<p
													className={classNames(styles.ndrBlue, styles.ndrBold)}
												>
													<a onClick={handleSelectAllItem}>
														{t('pages.compareDetail.selectAll')}
													</a>
												</p>
											</div>

											{/* 비교 표 */}
											<CompareDetailTable
												currencyCode={currencyCode}
												searchSpecValue={searchSpecValue}
												specList={specList}
												compareDetailItems={compareDetailItems}
												totalCount={totalCount}
												handleSelectItem={handleSelectItem}
												handleDeleteItem={handleDeleteItem}
												selectedCompareDetailItems={selectedCompareDetailItems}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

CompareDetailPage.displayName = 'CompareDetail';
