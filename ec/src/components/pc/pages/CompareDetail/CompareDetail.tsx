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
													<a>{t('pages.compareDetail.delete')}</a>
												</p>
												<p>|</p>
												<p
													className={classNames(styles.ndrBlue, styles.ndrBold)}
												>
													{t('pages.compareDetail.selectAll')}
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
