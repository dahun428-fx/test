import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberTypeList.module.scss';
import { ProductAsideColumns } from './ProductAsideColumns';
import { ProductBaseColumn } from './ProductBaseColumn';
import { ProductSpecColumns } from '@/components/pc/pages/KeywordSearch/PartNumberTypeList/ProductSpecColumns';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { CurrencyProvider } from '@/components/pc/ui/text/Price';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import type { PartNumberSpecTypes } from '@/store/modules/pages/keywordSearch';
import { assertNotNull } from '@/utils/assertions';
import { getChildren, getHeight } from '@/utils/dom';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	totalCount: number;
	typeList: Series[];
	currencyCode?: string;
	partNumberTypeSpecs: PartNumberSpecTypes;
	onClick: (rowIndex: number) => void;
	showsBottom: boolean;
	expanded: boolean;
	setExpanded: (expanded: boolean) => void;
};

/**
 * Part number type list
 */
export const PartNumberTypeList: React.VFC<Props> = ({
	className,
	totalCount,
	typeList,
	currencyCode,
	partNumberTypeSpecs,
	showsBottom,
	expanded,
	onClick,
	setExpanded,
}) => {
	const { t } = useTranslation();
	const baseRef = useRef<HTMLTableElement>(null);
	const specRef = useRef<HTMLTableElement>(null);
	const asideRef = useRef<HTMLTableElement>(null);

	const [headerHeight, setHeaderHeight] = useState<string>();
	const [rowHeightList, setRowHeightList] = useState<string[]>([]);
	const [cursor, setCursor] = useState(-1);

	const rowActions = useMemo(() => {
		return {
			onMouseOver: (index: number) => setCursor(index),
			onMouseLeave: () => setCursor(-1),
			onClick: (index: number) => {
				const type = typeList[index];
				assertNotNull(type);
				ga.ecommerce.selectItem({
					seriesCode: type.seriesCode,
					itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
				});
				onClick(index);
				window.open(
					url
						.productDetail(type.seriesCode)
						.fromKeywordSearch(type.partNumber)
						.typeList(type.partNumber),
					'_blank'
				);
			},
		};
	}, [onClick, typeList]);

	useLayoutEffect(() => {
		const onResize = () => {
			if (baseRef.current == null || asideRef.current == null) {
				return;
			}

			const [baseHeader, baseBody] = getChildren(baseRef.current);
			const [specHeader, specBody] = specRef.current
				? getChildren(specRef.current)
				: [];
			const [asideHeader, asideBody] = getChildren(asideRef.current);

			if (!baseHeader || !asideHeader) {
				return;
			}

			// calculate header max height
			const headerHeight = Math.max(
				getHeight(baseHeader),
				specHeader ? getHeight(specHeader) : 0,
				getHeight(asideHeader)
			);
			setHeaderHeight(`${headerHeight}px`);

			if (!baseBody || !asideBody) {
				return;
			}

			// calculate each row height
			const baseRows = getChildren(baseBody);
			const specRows = specBody ? getChildren(specBody) : [];
			const asideRows = getChildren(asideBody);

			const rowHeightList = baseRows.map((baseRow, index) => {
				const specRow = specRows[index];
				const asideRow = asideRows[index];

				return `${Math.max(
					getHeight(baseRow),
					specRow ? getHeight(specRow) : 0,
					asideRow ? getHeight(asideRow) : 0
				)}px`;
			});
			setRowHeightList(rowHeightList);
		};

		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [partNumberTypeSpecs]);

	const handleClick = (expanded: boolean) => {
		setExpanded(!expanded);
	};

	return (
		<Section
			id="partNumberTypeList"
			className={className}
			title={t('pages.keywordSearch.partNumberTypeList.heading', {
				totalCount,
			})}
		>
			<div className={styles.container}>
				<CurrencyProvider ccyCode={currencyCode}>
					<ProductBaseColumn
						typeList={typeList}
						tableRef={baseRef}
						headerHeight={headerHeight}
						rowHeightList={rowHeightList}
						cursor={cursor}
						rowActions={rowActions}
						className={styles.productBaseColumn}
					/>
					<ProductSpecColumns
						partNumberTypeSpecs={partNumberTypeSpecs}
						tableRef={specRef}
						headerHeight={headerHeight}
						rowHeightList={rowHeightList}
						cursor={cursor}
						rowActions={rowActions}
						className={styles.productSpecColumn}
					/>
					<ProductAsideColumns
						typeList={typeList}
						tableRef={asideRef}
						headerHeight={headerHeight}
						rowHeightList={rowHeightList}
						cursor={cursor}
						rowActions={rowActions}
						className={styles.productAsideColumns}
					/>
				</CurrencyProvider>
			</div>
			{showsBottom && (
				<ul className={styles.showMoreList}>
					<li className={styles.showMoreItem}>
						<div className={styles.itemWrap}>
							{!expanded && (
								<button
									className={styles.showMoreButton}
									onClick={() => handleClick(expanded)}
								>
									{t('pages.keywordSearch.partNumberTypeList.showMoreButton')}
								</button>
							)}
						</div>
						<span className={styles.itemCount}>
							{t('pages.keywordSearch.partNumberTypeList.typeCount', {
								displayCount: typeList.length,
								totalCount,
							})}
						</span>
					</li>
					{expanded && (
						<li className={styles.closeButtonWrap}>
							<button
								className={styles.closeButton}
								onClick={() => handleClick(expanded)}
							>
								{t('pages.keywordSearch.partNumberTypeList.close')}
							</button>
						</li>
					)}
				</ul>
			)}
		</Section>
	);
};
PartNumberTypeList.displayName = 'PartNumberTypeList';
