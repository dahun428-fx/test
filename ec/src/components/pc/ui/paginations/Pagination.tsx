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
	/** ページネーションで表示するページボタンの最大個数 */
	maxPageCount?: number;
	/** 変更イベントのハンドラ */
	onChange: (page: number) => void;
};

/**
 * ページネーションで表示するページ番号群を作成
 *
 * @param currentPage 現在のページ
 * @param totalPageCount 全ページ数
 * @param maxPageCount
 */
const createPages = (
	currentPage: number,
	totalPageCount: number,
	maxPageCount: number
): number[] => {
	// maxPageCount = 5 の場合:
	// 先頭は (現在のページ - 2) と (全ページ数 - 4) のより小さい値、かつ最小は 1
	// maxPageCount = 10 の場合:
	// 先頭は (現在のページ - 5) と (全ページ数 - 9) のより小さい値、かつ最小は 1
	const headPage = Math.max(
		Math.min(
			currentPage - Math.ceil((maxPageCount - 1) / 2),
			totalPageCount - (maxPageCount - 1)
		),
		1
	);

	// maxPageCount = 5 の場合:
	// 最後は (現在のページ + 2) と 5 のより大きい値、かつ最大は全ページ数
	// maxPageCount = 10 の場合:
	// 最後は (現在のページ + 4) と 10 のより大きい値、かつ最大は全ページ数
	const tailPage = Math.min(
		Math.max(currentPage + Math.floor((maxPageCount - 1) / 2), maxPageCount),
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
	maxPageCount = 5,
	onChange,
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
		<div className={styles.container}>
			{currentPage > 1 && (
				<li className={styles.item}>
					<a
						href={createQuery(currentPage - 1)}
						className={classNames(styles.arrow, styles.arrowLeft)}
						onClick={e => {
							e.preventDefault();
							handleClick(currentPage - 1);
						}}
					>
						{`${t('components.ui.pagination.prev')}`}
					</a>
				</li>
			)}
			{pageList.map(page => (
				<li className={styles.item} key={page}>
					<a
						href={createQuery(page)}
						className={classNames(styles.link, {
							[String(styles.active)]: currentPage === page,
						})}
						onClick={e => {
							e.preventDefault();
							handleClick(page);
						}}
					>
						{page}
					</a>
				</li>
			))}
			{currentPage < maxPage && (
				<li className={styles.item}>
					<a
						href={createQuery(currentPage + 1)}
						className={classNames(styles.arrow, styles.arrowRight)}
						onClick={e => {
							e.preventDefault();
							handleClick(currentPage + 1);
						}}
					>
						{`${t('components.ui.pagination.next')}`}
					</a>
				</li>
			)}
		</div>
	);
};
Pagination.displayName = 'Pagination';
