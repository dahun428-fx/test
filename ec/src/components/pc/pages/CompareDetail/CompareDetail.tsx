import {
	CompareDetailLoadStatus,
	SpecListType,
} from '@/store/modules/pages/compareDetail';
import styles from './CompareDetail.module.scss';
import { Meta } from './Meta';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import classNames from 'classnames';
import { Button } from '../../ui/buttons';
import { useTranslation } from 'react-i18next';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { pagesPath } from '@/utils/$path';
import { NagiLink } from '../../ui/links';
import { DaysToShip } from '../../ui/text/DaysToShip';

type SpecType = 'brand';
type SpecParamType = {
	title: string;
	children: JSX.Element[] | string;
	className: string | undefined;
	key: string;
};
type Props = {
	status: boolean;
	specList: SpecListType[];
	seriesList: Series[];
	partNumberList: PartNumber[];
	totalCount: number;
	categoryName: string;
};
export const CompareDetail: React.FC<Props> = ({
	status,
	specList,
	seriesList,
	partNumberList,
	totalCount,
	categoryName,
}) => {
	console.log('status ===> ', status);
	console.log('specList ===> ', specList);
	const [t] = useTranslation();
	const LIST_MAX_COUNT = 5;

	const imageHTMLPrint = () => {
		let html = seriesList.map((item, index) => {
			const productImageUrl = item.productImageList[0]?.url || '';
			return (
				<td key={`${item.seriesCode}_${index}`} className={styles.product}>
					<div className={styles.tableCheckbox}></div>
					<div className={styles.closeBtn}></div>
					<div className={styles.tableImg}>
						<ProductImage
							imageUrl={productImageUrl}
							preset="t_product_main"
							comment={item.seriesName}
						/>
					</div>
				</td>
			);
		});
		if (LIST_MAX_COUNT > totalCount) {
			const remainCount = LIST_MAX_COUNT - totalCount;
			const rowSpan = specList.length + 3;
			for (let i = 0; i < remainCount; i++) {
				html.push(
					<td
						key={`empty_${i}`}
						className={styles.product}
						rowSpan={rowSpan}
					></td>
				);
			}
		}
		return html;
	};

	const specHtmlPrint = () => {
		return specList.map((item, index) => {
			const { diffTypeCode, specTypeCode } = item;
			const isDiffRow = diffTypeCode % 2 !== 0;
			if (diffTypeCode > 2) {
				const className = classNames(isDiffRow && styles.tableDiffRow);
				switch (specTypeCode) {
					case '9':
						return (
							<tr key={`brand_${index}`} className={className}>
								<th>{`브랜드`}</th>
								{seriesList.map((seriesItem, seriesIndex) => {
									return (
										<td key={`brand_${seriesItem.seriesCode}_${seriesIndex}`}>
											{seriesItem.brandName}
										</td>
									);
								})}
							</tr>
						);
					case '0':
						return (
							<tr key={`price_${index}`} className={className}>
								<th>{`수량할인`}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`price_${partNumberItem.partNumber}`}>
											{partNumberItem.volumeDiscountFlag ? '있음' : '-'}
										</td>
									);
								})}
							</tr>
						);
					case '1':
						return (
							<tr key={`shipping_date_${index}`} className={className}>
								<th>{`출하일`}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`shipping_date_${partNumberItem.partNumber}`}>
											<DaysToShip
												minDaysToShip={partNumberItem.minStandardDaysToShip}
												maxDaysToShip={partNumberItem.maxStandardDaysToShip}
											/>
										</td>
									);
								})}
							</tr>
						);
					case '2':
						return;

					default:
						break;
				}
			}
		});
	};

	const priceDiscountHtml = (key: string) => {
		return <tr key={key}></tr>;
	};

	const getTitle = (type: SpecType) => {
		switch (type) {
			case 'brand':
				return '브랜드';
			default:
				return '';
		}
	};
	const getChildren = (type: SpecType): JSX.Element[] | string => {
		switch (type) {
			case 'brand':
				return brandHtml();
			default:
				return '';
		}
	};

	const createParam = (
		type: SpecType,
		isDiffRow: boolean,
		key: string
	): SpecParamType => {
		return {
			title: getTitle(type),
			children: getChildren(type),
			className: isDiffRow ? styles.tableDiffRow : '',
			key: key,
		};
	};

	const specChildrenHtmlPrint = (
		title: string,
		children: JSX.Element[] | string,
		className: string | undefined,
		key: string
	) => {
		return (
			<tr key={key} className={className ?? ''}>
				<th>{title}</th>
				{children}
			</tr>
		);
	};

	const brandHtml = () => {
		return seriesList.map((seriesItem, seriesIndex) => {
			return (
				<td key={`brandName_${seriesItem.seriesCode}_${seriesIndex}`}>
					{seriesItem.brandName}
				</td>
			);
		});
	};

	return (
		<>
			<Meta />
			<div className={styles.page}>
				<div className={styles.breadcrumbWrap}>
					<Breadcrumbs breadcrumbList={[{ text: '비교결과' }]} />
				</div>
				<div className={styles.main}>
					<div>
						<div>
							<h1 className={styles.heading}>{categoryName} 비교결과</h1>
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
													총 <span className={styles.total}>0</span>건
												</p>
												<p className={styles.totalSelect}>
													|<span className={styles.totalSelect}>건 선택</span>
												</p>
											</div>
											<div className={styles.right}>
												<p
													className={classNames(styles.ndrBlue, styles.ndrBold)}
												>
													<a>삭제</a>
												</p>
												<p>|</p>
												<p
													className={classNames(styles.ndrBlue, styles.ndrBold)}
												>
													전체선택
												</p>
											</div>

											{/* 비교 표 */}
											<div className={styles.compareTable}>
												<table className={styles.tableInfo}>
													<colgroup>
														<col />
														<col />
														<col />
														<col />
														<col />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>이미지</th>
															{imageHTMLPrint()}
														</tr>
														<tr>
															<th>상품명</th>
															{seriesList.map(item => {
																return (
																	<td className={styles.product}>
																		<p className={styles.ndrThin}>
																			{item.seriesName}
																		</p>
																	</td>
																);
															})}
														</tr>
														<tr>
															<th>형번</th>

															{partNumberList.map((item, index) => {
																const seriesUrl = pagesPath.vona2.detail
																	._seriesCode(
																		seriesList[index]?.seriesCode || ''
																	)
																	.$url({
																		query: { HissuCode: item.partNumber },
																	});
																return (
																	<td className={styles.product}>
																		<NagiLink href={seriesUrl}>
																			<p
																				className={classNames(
																					styles.ndrThin,
																					styles.productType,
																					styles.productTypeNewWindow
																				)}
																			>
																				{item.partNumber}
																			</p>
																		</NagiLink>
																	</td>
																);
															})}
														</tr>

														{specHtmlPrint()}
													</tbody>
												</table>
											</div>
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
