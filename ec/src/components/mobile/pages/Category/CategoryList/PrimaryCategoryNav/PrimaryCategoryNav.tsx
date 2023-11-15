import Link from 'next/link';
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import styles from './PrimaryCategoryNav.module.scss';
import { NavShortcut } from '@/components/mobile/pages/Category/CategoryList/PrimaryCategoryNav/NavShortcut';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { assertNotNull } from '@/utils/assertions';
import { getChildren, getRect, getWidth } from '@/utils/dom';

type Props = {
	cursor: number;
	primaryCategoryList: Category[];
	categoryName?: string;
	changeCursor: (index: number) => void;
};

const BeforeMemo = forwardRef<HTMLDivElement, Props>(
	({ cursor, primaryCategoryList, categoryName, changeCursor }, ref) => {
		const listRef = useRef<HTMLUListElement>(null);
		const [lastItemMarginRight, setLastItemMarginRight] = useState(0);
		const handleClickLink = useCallback(
			(index: number) => {
				changeCursor(index);
			},
			[changeCursor]
		);

		useEffect(() => {
			if (listRef.current) {
				const children = getChildren(listRef.current);
				const target = children[cursor];
				assertNotNull(target);
				const rect = getRect(target);
				listRef.current.scrollTo({
					behavior: 'smooth',
					left: rect.left + listRef.current.scrollLeft - 10,
				});
			}
		}, [cursor]);

		useLayoutEffect(() => {
			if (!listRef.current || !listRef.current) {
				return;
			}
			const lastItem = listRef.current.querySelector('li:nth-last-child(2)');
			if (!(lastItem instanceof HTMLLIElement)) {
				return;
			}
			const lastItemWidth = getWidth(lastItem);
			const listWidth = getWidth(listRef);
			if (!listWidth) {
				return;
			}
			// NOTE: total horizontal margin of item is 16px
			setLastItemMarginRight(listWidth - lastItemWidth - 16);
		}, [primaryCategoryList, cursor]);

		return (
			<div className={styles.container} ref={ref}>
				<h1 className={styles.heading}>{categoryName}</h1>
				<nav className={styles.nav}>
					<ul className={styles.list} ref={listRef}>
						{primaryCategoryList.map((category, index) => (
							<li
								key={category.categoryCode}
								className={styles.item}
								data-active={cursor === index}
							>
								<Link
									href={pagesPath.vona2
										._categoryCode([category.categoryCode])
										.$url()}
								>
									<a
										className={styles.link}
										onClick={() => handleClickLink(index)}
									>
										{category.categoryName}
									</a>
								</Link>
							</li>
						))}
						<li style={{ minWidth: lastItemMarginRight }}></li>
					</ul>
					<NavShortcut
						className={styles.shortcut}
						primaryCategoryList={primaryCategoryList}
						onClick={changeCursor}
					/>
				</nav>
			</div>
		);
	}
);

export const PrimaryCategoryNav = memo(BeforeMemo);
PrimaryCategoryNav.displayName = 'PrimaryCategoryNav';
