import classNames from 'classnames';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberList.module.scss';
import { UnitPrice } from './UnitPrice';
import { HEADER_WRAPPER_ID } from '@/components/mobile/layouts/headers/Header';
import { SaleLabel } from '@/components/mobile/ui/labels';
import { Link } from '@/components/mobile/ui/links';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { Pagination } from '@/components/mobile/ui/paginations';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { Regulation } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { pagesPath } from '@/utils/$path';
import { getHeight } from '@/utils/dom';
import { rohsFlagDisp } from '@/utils/domain/rohs';

type Props = {
	seriesCode: string;
	currencyCode?: string;
	totalCount: number;
	partNumberList: PartNumber[];
	notStandardSpecList: Spec[];
	regulationList: Regulation[];
	relatedLinkFrameFlag: Flag;
	rohsFrameFlag: Flag;
	reload: (condition: Partial<SearchPartNumberRequest>) => void;
	onClickPartNumber?: () => void;
	loading: boolean;
	page: number;
};

export const PartNumberList: React.VFC<Props> = ({
	seriesCode,
	currencyCode,
	totalCount,
	partNumberList,
	notStandardSpecList,
	regulationList,
	relatedLinkFrameFlag,
	rohsFrameFlag,
	reload,
	onClickPartNumber,
	loading,
	page,
}) => {
	const [t] = useTranslation();
	const tableHeaderCellRef = useRef<HTMLTableCellElement>(null);
	const headerHeight = getHeight(`#${HEADER_WRAPPER_ID}`) ?? 0;

	const hasPageStandardUnitPrice = useMemo(() => {
		return partNumberList.some(
			partNumber => partNumber.standardUnitPrice !== undefined
		);
	}, [partNumberList]);

	const hasPiecesPerPackage = useMemo(() => {
		return partNumberList.some(
			partNumber => partNumber.piecesPerPackage !== undefined
		);
	}, [partNumberList]);

	const handleChangePage = useCallback(
		(page: number) => {
			reload({
				pageSize: PAGE_SIZE,
				page,
			});
			if (tableHeaderCellRef.current) {
				const top =
					tableHeaderCellRef.current.getBoundingClientRect().top +
					window.scrollY -
					headerHeight;
				window.scroll({ top, behavior: 'smooth' });
			}
		},
		[headerHeight, reload]
	);

	const handleClickPartNumber = useCallback(
		({ partNumber, innerCode }: PartNumber) => {
			reload({
				partNumber,
				innerCode,
			});
			onClickPartNumber && onClickPartNumber();
			window.scroll({ top: 0, behavior: 'smooth' });
		},
		[onClickPartNumber, reload]
	);

	return (
		<div className={styles.partNumberList}>
			<div className={styles.wrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th
								className={classNames(styles.th, styles.partNumber)}
								ref={tableHeaderCellRef}
							>
								{t('mobile.pages.productDetail.partNumberList.partNumber')}
							</th>
							{Flag.isTrue(relatedLinkFrameFlag) && (
								<th className={styles.th}>
									{t('mobile.pages.productDetail.partNumberList.relatedTo')}
								</th>
							)}
							{!!hasPageStandardUnitPrice && (
								<th className={styles.th}>
									{t(
										'mobile.pages.productDetail.partNumberList.standardUnitPrice'
									)}
								</th>
							)}
							{!!hasPiecesPerPackage && (
								<th className={styles.th}>
									{t(
										'mobile.pages.productDetail.partNumberList.piecesPerPackage'
									)}
								</th>
							)}
							<th className={styles.th}>
								{t(
									'mobile.pages.productDetail.partNumberList.minOrderQuantity'
								)}
							</th>
							<th className={styles.th}>
								{t('mobile.pages.productDetail.partNumberList.volumeDiscount')}
							</th>
							<th className={styles.th}>
								{t('mobile.pages.productDetail.partNumberList.daysToShip')}
							</th>
							{Flag.isTrue(rohsFrameFlag) && (
								<th className={styles.th}>
									{t('mobile.pages.productDetail.partNumberList.rohs')}
								</th>
							)}
							{regulationList.map(regulation => (
								<th key={regulation.regulationCode} className={styles.th}>
									{regulation.regulationName}
								</th>
							))}
							{notStandardSpecList.map(spec => (
								<th key={spec.specCode} className={styles.th}>
									<div
										dangerouslySetInnerHTML={{ __html: `(${spec.specName})` }}
									/>
									{!!spec.specUnit && (
										<div
											dangerouslySetInnerHTML={{ __html: `(${spec.specUnit})` }}
										/>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{partNumberList.map(partNumber => (
							<tr key={`${partNumber.innerCode}\t${partNumber.partNumber}`}>
								<td
									className={classNames(
										styles.td,
										styles.partNumber,
										styles.leftAlign
									)}
								>
									{partNumberList.length <= 1 ? (
										<div title={partNumber.partNumber}>
											{partNumber.partNumber}
										</div>
									) : Flag.isTrue(partNumber.simpleFlag) ? (
										<Link
											title={partNumber.partNumber}
											onClick={event => {
												event.preventDefault();
												handleClickPartNumber(partNumber);
											}}
											href={pagesPath.vona2.detail
												._seriesCode(seriesCode)
												.$url({
													query: { HissuCode: partNumber.partNumber },
												})}
											className={styles.link}
										>
											{partNumber.partNumber}
										</Link>
									) : (
										<div
											title={partNumber.partNumber}
											onClick={event => {
												event.preventDefault();
												handleClickPartNumber(partNumber);
											}}
											className={styles.link}
										>
											{partNumber.partNumber}
										</div>
									)}
									{!!partNumber.campaignEndDate && <SaleLabel />}
								</td>

								{Flag.isTrue(relatedLinkFrameFlag) && (
									<td className={styles.td}>
										{partNumber.relatedLinkList.length > 0
											? partNumber.relatedLinkList.map((relatedLink, index) => (
													<a
														key={index}
														href={relatedLink.relatedInfoUrl}
														target="_blank"
														rel="noreferrer"
													>
														{relatedLink.relatedLinkTypeDisp}
													</a>
											  ))
											: `-`}
									</td>
								)}

								{hasPageStandardUnitPrice && (
									<td className={styles.td}>
										{!!partNumber.campaignUnitPrice ||
										!!partNumber.campaignEndDate ? (
											<UnitPrice
												standardUnitPrice={partNumber.standardUnitPrice}
												unitPrice={partNumber.campaignUnitPrice}
												currencyCode={currencyCode}
											/>
										) : (
											<UnitPrice
												unitPrice={partNumber.standardUnitPrice}
												currencyCode={currencyCode}
											/>
										)}
									</td>
								)}

								{hasPiecesPerPackage && (
									<td className={styles.td}>
										{partNumber.piecesPerPackage ?? `-`}
									</td>
								)}

								<td className={styles.td}>
									{t(
										'mobile.pages.productDetail.partNumberList.minQuantityData',
										{
											quantity: !!partNumber.minQuantity
												? partNumber.minQuantity
												: 1,
										}
									)}
								</td>

								<td className={styles.td}>
									{Flag.isTrue(partNumber.volumeDiscountFlag)
										? t('mobile.pages.productDetail.partNumberList.available')
										: null}
								</td>

								<td className={styles.td}>
									<DaysToShip
										minDaysToShip={partNumber.minStandardDaysToShip}
										maxDaysToShip={partNumber.maxStandardDaysToShip}
									/>
								</td>

								{Flag.isTrue(rohsFrameFlag) && (
									<td className={styles.td}>
										{rohsFlagDisp(partNumber.rohsFlag)}
									</td>
								)}

								{regulationList.map(regulation => (
									<td key={regulation.regulationCode} className={styles.td}>
										{
											partNumber.regulationValueList?.find(
												regulationValue =>
													regulationValue.regulationCode ===
													regulation.regulationCode
											)?.regulationValue
										}
									</td>
								))}

								{notStandardSpecList.map(spec => (
									<td
										key={spec.specCode}
										className={styles.td}
										dangerouslySetInnerHTML={{
											__html:
												partNumber.specValueList?.find(
													specValue => specValue.specCode === spec.specCode
												)?.specValueDisp ?? '-',
										}}
									/>
								))}
							</tr>
						))}
					</tbody>
				</table>
				{loading && <BlockLoader className={styles.loader} />}
			</div>
			<div className={styles.foot}>
				<Pagination
					page={page}
					pageSize={PAGE_SIZE}
					totalCount={totalCount}
					onChange={handleChangePage}
				/>
			</div>
		</div>
	);
};
PartNumberList.displayName = 'PartNumberList';
