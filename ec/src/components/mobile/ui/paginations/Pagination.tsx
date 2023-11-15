import classNames from 'classnames';
import Router from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Pagination.module.scss';
import { range } from '@/utils/number';
import { fromEntries } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

export type Props = {
	/** 現在のページ */
	page: number;
	/** ページサイズ */
	pageSize: number;
	/** 検索対象の全件数 */
	totalCount: number;
	/** Query param keys */
	queryParamKeys?: ReadonlyArray<string>;
	/** 変更イベントのハンドラ */
	onChange: (page: number) => void;
	/** ページネーションで表示するページボタンの最大個数 */
	maxPageCount?: number;
};

// ページネーションで表示するページボタンの最大個数(5)
const MAX_PAGE_COUNT = 5;

/**
 * ページネーションで表示するページ番号群を作成
 *
 * @param currentPage 現在のページ
 * @param totalPageCount 全ページ数
 */
const createPages = (
	currentPage: number,
	totalPageCount: number,
	maxPageCount: number
): number[] => {
	// 先頭は (現在のページ - 2) と (全ページ数 - 4) のより小さい値、かつ最小は 1
	const headPage = Math.max(
		Math.min(currentPage - 2, totalPageCount - (maxPageCount - 1)),
		1
	);

	// 最後は (現在のページ + 2) と 5 のより大きい値、かつ最大は全ページ数
	const tailPage = Math.min(
		Math.max(currentPage + 2, maxPageCount),
		totalPageCount
	);

	return range(headPage, tailPage + 1);
};

function isFillEntry(
	entry: [string, string | undefined]
): entry is [string, string] {
	return notNull(entry[1]);
}

/**
 * ページネーション
 */
export const Pagination: React.VFC<Props> = ({
	page: currentPage,
	pageSize,
	totalCount,
	queryParamKeys = [],
	onChange,
	maxPageCount = MAX_PAGE_COUNT,
}) => {
	const [t] = useTranslation();

	/**
	 * ページ総数
	 */
	const maxPage = useMemo(
		() => Math.ceil(totalCount / pageSize),
		[pageSize, totalCount]
	);

	/**
	 * ページリスト
	 */
	const pageList = useMemo(
		() => createPages(currentPage, maxPage, maxPageCount),
		[currentPage, maxPage, maxPageCount]
	);

	const queryParams = useMemo(() => {
		if (queryParamKeys.length === 0) {
			return {};
		}
		return fromEntries(
			Object.entries(getOneParams(Router.query, ...queryParamKeys)).filter(
				isFillEntry
			)
		);
	}, [queryParamKeys]);

	const createQuery = (page: number) => {
		return `?${new URLSearchParams({
			// NOTE: Page is fixed;
			//       if there is any pagination other than by the Page keyword, it must be fixed.
			Page: String(page),
			...queryParams,
		}).toString()}`;
	};

	/** ページ番号のクリックハンドラ */
	const handleClick = (page: number): void => {
		onChange(page);
	};

	//===========================================================================
	if (totalCount < 1) {
		return null;
	}

	return (
		<div className={styles.pagination}>
			<div className={styles.linkBox}>
				{currentPage > 1 && (
					<a
						href={createQuery(currentPage - 1)}
						className={styles.link}
						onClick={e => {
							e.preventDefault();
							handleClick(currentPage - 1);
						}}
					>
						{`<< ${t('mobile.components.ui.paginations.prev')}`}
					</a>
				)}
			</div>
			<div>
				{pageList.map(page => (
					<a
						href={createQuery(page)}
						key={page}
						className={classNames(styles.pageButton, {
							[String(styles.active)]: currentPage === page,
						})}
						onClick={e => {
							e.preventDefault();
							handleClick(page);
						}}
					>
						{page}
					</a>
				))}
			</div>
			<div className={styles.linkBox}>
				{currentPage < maxPage && (
					<a
						href={createQuery(currentPage + 1)}
						className={styles.link}
						onClick={e => {
							e.preventDefault();
							handleClick(currentPage + 1);
						}}
					>
						{`${t('mobile.components.ui.paginations.next')} >>`}
					</a>
				)}
			</div>
		</div>
	);
};
Pagination.displayName = 'Pagination';
