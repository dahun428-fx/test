import {
	FC,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import Sticky from 'react-stickynode';
import styles from './CategoryList.module.scss';
import { PrimaryCategoryNav } from './PrimaryCategoryNav';
import {
	SecondaryCategoryGroups,
	getCategoryCode,
	getId,
} from './SecondaryCategoryGroups';
import { SecondaryCategoryNav } from './SecondaryCategoryNav';
import { HEADER_WRAPPER_ID } from '@/components/mobile/layouts/headers/Header';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useScrollStart } from '@/hooks/ui/useScrollStart';
import { useScrollTo } from '@/hooks/ui/useScrollTo';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { assertNotNull } from '@/utils/assertions';
import { getHeight, getTop } from '@/utils/dom';
import { CategoryWithLevel, createCategoryMap } from '@/utils/domain/category';
import { pick } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import { sleep } from '@/utils/timer';

type Props = {
	initialCategoryCode: string;
	categoryList: Category[];
	topCategoryCode: string;
};

export const CategoryList: FC<Props> = ({
	initialCategoryCode,
	categoryList,
	topCategoryCode,
}) => {
	// 表示中のTOPカテゴリのインデックス
	const [cursor, setCursor] = useState(
		categoryList.findIndex(
			category => category.categoryCode === topCategoryCode
		)
	);
	/** 表示中のTOPカテゴリ */
	const primaryCategory = categoryList[cursor];
	assertNotNull(primaryCategory);
	/** TOPカテゴリの子カテゴリ */
	const secondaryCategoryList = primaryCategory.childCategoryList;

	/** カテゴリコードをキーとしたマップ */
	const categories = useMemo(() => {
		return createCategoryMap(primaryCategory, 6);
	}, [primaryCategory]);

	// フォーカスされているカテゴリ情報
	const [{ categoryCode, categoryName }, setSelectedCategory] = useState<{
		/** フォーカスされているカテゴリコード */
		categoryCode: string;
		/** 見出しに表示しているカテゴリ名 */
		categoryName: string;
	}>(getInitialCategory(categories[initialCategoryCode]));

	const currentCategory = categories[categoryCode];

	// サイドナビゲーションのカーソルを動かす系
	const primaryNavRef = useRef<HTMLDivElement>(null);
	const groupListRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const { scrollingRef, scrollTo } = useScrollTo(groupListRef);
	const { onStartScroll } = useScrollStart(groupListRef);

	/**
	 * 表示するカテゴリグループ
	 * フォーカスされているカテゴリのレベルによって表示内容が切り替わる
	 */
	const categoryGroupList = useMemo(() => {
		if (currentCategory && currentCategory.level > 2) {
			return [currentCategory];
		}
		return secondaryCategoryList;
	}, [currentCategory, secondaryCategoryList]);

	/** サイドナビゲーションにおけるフォーカス中のカテゴリコード */
	const secondaryCategoryCode = useMemo(() => {
		if (currentCategory && currentCategory.level > 2) {
			// NOTE: フォーカスされているカテゴリの第2カテゴリを選択状態とする
			return currentCategory.parentCategoryCodeList[1];
		}
		return categoryCode;
	}, [categoryCode, currentCategory]);

	const getCategoryCodeName = useCallback(
		(categoryCode: string) => {
			const category = categories[categoryCode];
			assertNotNull(category, `Not found in Categories map: ${categoryCode}`);
			return pick(category, 'categoryCode', 'categoryName');
		},
		[categories]
	);

	/** scroll 後に監視を再開する */
	const reserveObserving = useCallback(() => {
		onStartScroll(() => startObserving(observerRef, categoryGroupList));
		return () => observerRef.current?.disconnect();
	}, [categoryGroupList, onStartScroll]);

	/** 指定のカテゴリグループまでの offset を取得する */
	const getOffset = useCallback((target: HTMLDivElement) => {
		assertNotNull(groupListRef.current);
		assertNotNull(primaryNavRef.current);
		const targetTop = getTop(target);
		const headerHeight = getHeight(`#${HEADER_WRAPPER_ID}`) ?? 0;
		const navHeight = getHeight(primaryNavRef.current);
		const groupElementMargin = 12;
		return (
			groupListRef.current.scrollTop +
			targetTop -
			(headerHeight + navHeight + groupElementMargin)
		);
	}, []);

	/** 指定のカテゴリグループまで scroll する */
	const scrollToGroup = useCallback(
		(categoryCode: string) => {
			const groupElement = document.querySelector(
				`#${getId({ categoryCode })}`
			) as HTMLDivElement;

			if (groupElement && groupListRef.current) {
				scrollTo(getOffset(groupElement), { behavior: 'smooth' });
			}
		},
		[getOffset, scrollTo]
	);

	useEffect(() => {
		setCursor(
			categoryList.findIndex(
				category => category.categoryCode === topCategoryCode
			)
		);
	}, [categoryList, topCategoryCode]);

	useOnMounted(() => {
		// 初期表示時、URLの示すカテゴリにスクロールする
		if (currentCategory?.level === 2 && categoryCode) {
			scrollToGroup(categoryCode);
		}
	});

	useEffect(() => {
		// スクロールしたら監視開始
		return reserveObserving();
	}, [reserveObserving]);

	useEffect(() => {
		// observer の生成、state に保存
		if (groupListRef.current) {
			const observer = new IntersectionObserver(
				entries => {
					if (!scrollingRef.current) {
						// 第3層のカテゴリリストがビューポートに入った際に、サイドナビゲーションのカーソル位置や見出しを切り替える
						for (const entry of entries.filter(e => e.isIntersecting)) {
							const categoryCode = getCategoryCode(entry.target.id);
							assertNotNull(categoryCode);
							setSelectedCategory(getCategoryCodeName(categoryCode));
						}
					}
				},
				{ root: groupListRef.current, rootMargin: '0px' }
			);
			observerRef.current = observer;

			return () => observer.disconnect();
		}
	}, [getCategoryCodeName, scrollingRef]);

	const handleClickPrimary = useCallback(
		(cursor: number) => {
			setCursor(cursor);

			const primaryCategory = categoryList[cursor];
			assertNotNull(primaryCategory);
			// カテゴリ名はTOPカテゴリものを採用
			const { categoryCode, categoryName } = primaryCategory;
			// カテゴリコードはTOPカテゴリ配下の最初のカテゴリのものを採用
			// NOTE: API の返却項目なので、assertNotNull は敢えてしない
			const firstChild = primaryCategory.childCategoryList[0];
			setSelectedCategory({
				categoryCode: firstChild?.categoryCode ?? categoryCode,
				categoryName,
			});
			sleep(0).then(() => scrollTo(0));
		},
		[categoryList, scrollTo]
	);

	const handleClickSecondaryNav = useCallback(
		(categoryCode: string) => {
			const category = getCategoryCodeName(categoryCode);
			setSelectedCategory(category);

			// NOTE: 第4層のカテゴリ表示中に、サイドナビゲーションをクリックすると、
			//       第3層のカテゴリ表示へ切り替える最中のためスクロールされない。
			//       その解消のため、DOMが更新されたあと(厳密には違う)にスクロール処理を行う。
			sleep(0).then(() => scrollToGroup(categoryCode));
		},
		[getCategoryCodeName, scrollToGroup]
	);

	const handleClickTertiaryCursor = useCallback(
		(categoryCode: string) => {
			setSelectedCategory(getCategoryCodeName(categoryCode));
			sleep(0).then(() => scrollTo(0));
		},
		[getCategoryCodeName, scrollTo]
	);

	return (
		<div>
			<Sticky
				top={`#${HEADER_WRAPPER_ID}`}
				bottomBoundary="#category-contents"
				innerZ={1}
			>
				<PrimaryCategoryNav
					ref={primaryNavRef}
					cursor={cursor}
					primaryCategoryList={categoryList}
					categoryName={categoryName}
					changeCursor={handleClickPrimary}
				/>
			</Sticky>
			<div className={styles.contents} id="category-contents">
				<SecondaryCategoryNav
					secondaryCategoryList={secondaryCategoryList}
					categoryCode={secondaryCategoryCode}
					onClick={handleClickSecondaryNav}
				/>
				<SecondaryCategoryGroups
					className={styles.tertiaryList}
					ref={groupListRef}
					secondaryCategoryList={categoryGroupList}
					onClickTertiary={handleClickTertiaryCursor}
				/>
			</div>
		</div>
	);
};

function startObserving(
	observerRef: RefObject<IntersectionObserver | null>,
	categoryList: Category[]
) {
	if (observerRef.current != null) {
		const targets = categoryList
			.map(category => document.querySelector(`#${getId(category)}`))
			.filter(notNull);

		for (const target of targets) {
			observerRef.current?.observe(target);
		}

		return () => observerRef.current?.disconnect();
	}
}

function getInitialCategory(category: CategoryWithLevel | undefined) {
	// NOTE: カテゴリマップとURLのカテゴリ不一致（最初のレンダリングでは起きない）
	if (category == null) {
		return { categoryCode: '', categoryName: '' };
	}

	if (category.level === 1) {
		return {
			categoryCode:
				// NOTE: TOPカテゴリに子カテゴリがないなんてことはないと思うが念の為。
				category.childCategoryList[0]?.categoryCode ?? category.categoryCode,
			categoryName: category.categoryName,
		};
	}
	return pick(category, 'categoryCode', 'categoryName');
}
