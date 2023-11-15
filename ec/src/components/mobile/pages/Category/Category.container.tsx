import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState, VFC } from 'react';
import { Category as Presenter, Props } from './Category';
import styles from './Category.module.scss';
import { searchCategory } from '@/api/services/searchCategory';
import { NotFound } from '@/components/mobile/pages/NotFound';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { useBoolState } from '@/hooks/state/useBoolState';
import { cameleer } from '@/logs/cameleer';
import { ErrorCode } from '@/models/api/constants/ErrorCode';
import { AncesterType } from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { assertArray, assertNotEmpty, assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';
import { findByCategoryCode } from '@/utils/domain/category';

export const Category: VFC = () => {
	const router = useRouter();
	const [notFound, setNotFound] = useState(false);
	const [props, setProps] = useState<Omit<Props, 'loading'> | null>(null);
	const [loading, startToLoad, endLoading] = useBoolState(false);

	useEffect(() => {
		if (router.isReady) {
			startToLoad();

			// 画面が全部消えるより、残っている方が「カテゴリ画面からスペック検索への遷移」については
			// 良いと思うので set null していない
			// setProps(null);
			loadAtFirst(router.query).then(
				({
					redirectTo,
					notFound,
					topCategoryCode,
					categoryCode,
					categoryResponse,
					isTopCategory,
				}) => {
					if (redirectTo) {
						endLoading();
						router.replace(pagesPath.vona2._categoryCode(redirectTo).$url());
						return;
					}

					if (notFound) {
						endLoading();
						setNotFound(true);
						return;
					}

					// 1st response を props にセット
					assertNotNull(topCategoryCode); // tsc が正しく判定してくれない対策
					assertNotNull(categoryCode); // tsc が正しく判定してくれない対策
					assertNotNull(categoryResponse); // tsc が正しく判定してくれない対策
					assertNotNull(isTopCategory); // tsc が正しく判定してくれない対策
					const payload = { categoryCode, categoryResponse };
					const currentCategory = getCurrentCategory(payload);
					setProps({
						...payload,
						topCategoryCode,
						currentCategory,
						isTopCategory,
					});
					endLoading();
				},
				endLoading
			);
		}
	}, [endLoading, router, router.isReady, router.query, startToLoad]);

	useEffect(() => {
		if (props) {
			cameleer.viewCategory(props.currentCategory);
		}
	}, [props]);

	if (notFound) {
		return <NotFound />;
	}

	if (!props) {
		return (
			<div className={styles.loader}>
				<BlockLoader />
			</div>
		);
	}

	return <Presenter {...{ ...props, loading }} />;
};
Category.displayName = 'Category';

type LoadResult =
	| {
			redirectTo: string[]; // string is categoryCode
			notFound?: undefined;
			topCategoryCode?: undefined;
			categoryCode?: undefined;
			categoryResponse?: undefined;
			isTopCategory?: undefined;
	  }
	| {
			redirectTo?: undefined;
			notFound: true;
			topCategoryCode?: undefined;
			categoryCode?: undefined;
			categoryResponse?: undefined;
			isTopCategory?: undefined;
	  }
	| {
			redirectTo?: undefined;
			notFound?: undefined;
			topCategoryCode: string;
			categoryCode: string;
			categoryResponse: SearchCategoryResponse;
			isTopCategory: boolean;
	  };

async function loadAtFirst(query: ParsedUrlQuery): Promise<LoadResult> {
	const categoryCodeList = query.categoryCode;
	assertArray(categoryCodeList);

	const categoryCode = last(categoryCodeList);
	const topCategoryCode = categoryCodeList[0];
	const isTopCategory = categoryCodeList.length === 1;
	assertNotNull(categoryCode);
	assertNotNull(topCategoryCode);

	let categoryResponse;

	try {
		categoryResponse = await searchCategory({
			categoryCode,
			categoryLevel: isTopCategory ? 0 : 2,
			ancesterType: isTopCategory
				? AncesterType.NO_GET
				: AncesterType.GET_FROM_DIRECT_TOP_CATEGORY,
		});

		if (categoryResponse.categoryList.length === 0) {
			return { notFound: true };
		}
	} catch (error) {
		if (error instanceof MsmApiError) {
			if (error.isMovedPermanently) {
				const redirectTo = getRedirectTo(error);
				if (redirectTo) {
					return { redirectTo };
				}
			}
			// REVIEW: not found ではなくエラーにした方が良いこともある？
			return { notFound: true };
		}
		throw error;
	}

	return {
		topCategoryCode,
		categoryCode,
		categoryResponse,
		isTopCategory,
	};
}

function getRedirectTo(apiError: MsmApiError): false | string[] {
	if (apiError.response == null) {
		return false;
	}
	const params = apiError.errorParams(ErrorCode.MOVED_PERMANENTLY);

	if (params == null || params.length === 0) {
		return false;
	}
	return (
		Array.isArray(params[0]) &&
		params[0].every(v => typeof v === 'string') &&
		params[0]
	);
}

function getCurrentCategory(payload: {
	categoryCode: string;
	categoryResponse: SearchCategoryResponse;
}) {
	const {
		categoryCode,
		categoryResponse: { categoryList },
	} = payload;

	assertNotEmpty(categoryList, `Category not found. [code=${categoryCode}]`);
	// NOTE: このカテゴリ検索結果はカテゴリコードを唯一指定して得られたものであり、
	//       TOPカテゴリは常にカテゴリリストの1件目を参照すれば得られる。
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const currentCategory = findByCategoryCode(categoryList[0]!, categoryCode);

	assertNotNull(currentCategory);

	return currentCategory;
}
