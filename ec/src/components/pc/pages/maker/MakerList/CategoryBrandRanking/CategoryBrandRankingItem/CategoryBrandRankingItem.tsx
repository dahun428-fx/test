import classNames from 'classnames';
import { RefObject, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryBrandRankingItem.module.scss';
import { Link } from '@/components/pc/ui/links';
import { RecommendItems } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';

type Props = {
	categoryBrandRankingItem: RecommendItems;
	itemWidth: number;
	innerListRef: RefObject<HTMLUListElement>;
	isExpanded: boolean;
	containerHeight: number;
	onExpanded: () => void;
};

function formatLink(url: string | undefined) {
	if (!url) {
		return '';
	}

	return url.startsWith('//') ? url.replace('//', 'https://') : url;
}

/** Brand ranking item component */
export const CategoryBrandRankingItem: VFC<Props> = ({
	categoryBrandRankingItem,
	itemWidth,
	innerListRef,
	isExpanded,
	containerHeight,
	onExpanded,
}) => {
	const [t] = useTranslation();

	return (
		<li className={styles.container} style={{ width: itemWidth }}>
			<div className={styles.wrapperItem}>
				<div className={styles.brandName}>{categoryBrandRankingItem.name}</div>
				<div className={styles.linkListWrapper}>
					<div className={styles.linkList} style={{ height: containerHeight }}>
						<ul ref={innerListRef}>
							{categoryBrandRankingItem.innerItems.map((innerItem, index) => {
								return (
									<li
										key={`${innerItem.itemCd}-${index}`}
										className={styles.linkItem}
									>
										<Link href={formatLink(innerItem.linkUrl)}>
											{innerItem.name}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
					<p className={styles.viewMoreWrapper}>
						<a
							href="#"
							className={classNames({
								[String(styles.show)]: !isExpanded,
								[String(styles.hide)]: isExpanded,
							})}
							onClick={event => {
								event.preventDefault();
								onExpanded();
							}}
						>
							{isExpanded
								? t('pages.maker.categoryBrandRanking.hide')
								: t('pages.maker.categoryBrandRanking.viewMore')}
						</a>
					</p>
				</div>
			</div>
		</li>
	);
};
CategoryBrandRankingItem.displayName = 'CategoryBrandRankingItem';
