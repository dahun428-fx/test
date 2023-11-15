import Link from 'next/link';
import { memo, useCallback, useEffect, useRef } from 'react';
import styles from './SecondaryCategoryNav.module.scss';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { scrollParentToChild } from '@/utils/dom';
import { sleep } from '@/utils/timer';

const ID_PREFIX = 'ec-web-category-list-nav-';
type Id = `${typeof ID_PREFIX}${string}`;

function getId(categoryCode: string): Id {
	return `${ID_PREFIX}${categoryCode}`;
}

type Props = {
	secondaryCategoryList: Category[];
	categoryCode?: string;
	onClick: (categoryCode: string) => void;
};

export const SecondaryCategoryNav = memo<Props>(
	({ secondaryCategoryList, categoryCode: focusedCategoryCode, onClick }) => {
		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (ref.current && focusedCategoryCode) {
				sleep(0).then(() => {
					const dom = document.querySelector(`#${getId(focusedCategoryCode)}`);
					if (ref.current && dom) {
						scrollParentToChild(ref.current, dom);
					}
				});
			}
		}, [focusedCategoryCode]);

		const handleClick = useCallback(
			(categoryCode: string) => {
				onClick(categoryCode);
			},
			[onClick]
		);

		return (
			<div className={styles.container} ref={ref}>
				<ul>
					{secondaryCategoryList.map(
						({ categoryCode, categoryName, parentCategoryCodeList }) => (
							<li
								key={categoryCode}
								onClick={() => onClick(categoryCode)}
								className={styles.item}
								data-active={categoryCode === focusedCategoryCode}
								id={getId(categoryCode)}
							>
								<Link
									href={pagesPath.vona2
										._categoryCode([...parentCategoryCodeList, categoryCode])
										.$url()}
								>
									<a
										className={styles.link}
										onClick={() => handleClick(categoryCode)}
										dangerouslySetInnerHTML={{
											__html: categoryName.replace(/\//g, '&#8203;/&#8203;'),
										}}
									/>
								</Link>
							</li>
						)
					)}
				</ul>
			</div>
		);
	}
);
SecondaryCategoryNav.displayName = 'SecondaryCategoryNav';
