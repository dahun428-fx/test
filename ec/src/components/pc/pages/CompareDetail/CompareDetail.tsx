import { SpecListType } from '@/store/modules/pages/compareDetail';
import styles from './CompareDetail.module.scss';
import { Meta } from './Meta';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import classNames from 'classnames';
import { Button } from '../../ui/buttons';
import { useTranslation } from 'react-i18next';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { CompareDetailTable } from './CompareDetailTable';
import { useCallback, useRef, useState } from 'react';

type Props = {
	status: boolean;
	specList: SpecListType[];
	seriesList: Series[];
	partNumberList: PartNumber[];
	totalCount: number;
	categoryName: string;
	currencyCode: string;
	searchSpecValue: (
		partNumber: PartNumber | undefined,
		specCode: string | undefined
	) => string;
};
export const CompareDetail: React.FC<Props> = ({
	status,
	specList,
	seriesList,
	partNumberList,
	totalCount,
	categoryName,
	currencyCode,
	searchSpecValue,
}) => {
	const [t] = useTranslation();
	type CompareTargetType = {
		index?: number;
		seriesCode?: string;
		partNumber?: string;
	};
	const compareList = useRef<CompareTargetType[]>([]);
	const [selectedCompareDetailItems, setSelectedCompareDetailItems] = useState<
		Set<number>
	>(new Set());

	const setCompareList = (
		index?: number,
		seriesCode?: string | null,
		partNumber?: string | null
	) => {
		if (index === undefined) return;

		const target = compareList.current[index];
		if (seriesCode) {
			compareList.current[index] = {
				index,
				...target,
				seriesCode,
			};
		}
		if (partNumber) {
			compareList.current[index] = {
				index,
				...target,
				partNumber,
			};
		}
	};

	console.log('compareList ===> ', compareList);
	console.log('selectedCompareDetailItems ===> ', selectedCompareDetailItems);
	const handleSelectItem = useCallback(
		(item: number) => {
			const isSelected = selectedCompareDetailItems.has(item);
			if (isSelected) {
				selectedCompareDetailItems.delete(item);
			} else {
				selectedCompareDetailItems.add(item);
			}
			setSelectedCompareDetailItems(
				new Set(Array.from(selectedCompareDetailItems))
			);
		},
		[selectedCompareDetailItems]
	);
	const handleSelectAllItem = () => {
		const isAllSelected = selectedCompareDetailItems.size === totalCount;
		if (isAllSelected) {
			setSelectedCompareDetailItems(new Set());
		} else {
			for (let i = 0; i < totalCount; i++) {
				selectedCompareDetailItems.add(i);
			}
			setSelectedCompareDetailItems(new Set(selectedCompareDetailItems));
		}
	};

	const handleDeleteItem = (index: number) => {
		console.log(
			'handleDeleteItem ===> ',
			index,
			'====> ',
			compareList.current[index]
		);
	};

	const handleDeleteAllItem = () => {
		console.log('handleDeleteAllItem');
	};

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
												partNumberList={partNumberList}
												searchSpecValue={searchSpecValue}
												seriesList={seriesList}
												specList={specList}
												totalCount={totalCount}
												setCompareList={setCompareList}
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

CompareDetail.displayName = 'CompareDetail';
