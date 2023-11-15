import React from 'react';
import { Trans } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './CategoryList.module.scss';
import { CategoryTile } from './CategoryTile';
import { HEADER_WRAPPER_ID } from '@/components/mobile/layouts/headers/Header';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getHeight } from '@/utils/dom';
import { uuidv4 } from '@/utils/uuid';

type Props = {
	categoryResponse: SearchCategoryResponse;
	keyword: string;
};

export const CATEGORY_LIST_WRAPPER_ID = `category-list-wrapper-${uuidv4()}`;

/**
 * Category list
 */
export const CategoryList: React.VFC<Props> = ({
	categoryResponse,
	keyword,
}) => {
	return (
		<Sticky
			top={getHeight(`#${HEADER_WRAPPER_ID}`)}
			innerActiveClass={styles.sticky}
		>
			<div className={styles.section} id={CATEGORY_LIST_WRAPPER_ID}>
				<div className={styles.categoryHeader}>
					<Trans
						i18nKey="mobile.pages.keywordSearch.categoryList.heading"
						values={{ totalCount: categoryResponse.totalCount }}
					>
						<strong />
						<span className={styles.num} />
					</Trans>
				</div>
				<ul className={styles.list}>
					{categoryResponse.categoryList.map(category => (
						<li className={styles.categoryItem} key={category.categoryCode}>
							<CategoryTile category={category} keyword={keyword} />
						</li>
					))}
				</ul>
			</div>
		</Sticky>
	);
};
CategoryList.displayName = 'CategoryList';
