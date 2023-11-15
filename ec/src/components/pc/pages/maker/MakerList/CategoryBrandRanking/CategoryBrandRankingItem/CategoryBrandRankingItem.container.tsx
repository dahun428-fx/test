import {
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
	VFC,
} from 'react';
import { CategoryBrandRankingItem as Presenter } from './CategoryBrandRankingItem';
import { RecommendItems } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';
import { first } from '@/utils/collection';
import { getChildren, getHeight } from '@/utils/dom';

const MAX_ITEM_PER_SCREEN = 6;

type Props = {
	categoryBrandRankingItem: RecommendItems;
	itemWidth: number;
	innerListRef: RefObject<HTMLUListElement>;
};

/** Brand ranking item container */
export const CategoryBrandRankingItem: VFC<Props> = ({
	categoryBrandRankingItem,
	itemWidth,
}) => {
	const innerListRef = useRef<HTMLUListElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);
	const isDisableCollapsed =
		categoryBrandRankingItem.innerItems.length <= MAX_ITEM_PER_SCREEN;

	const handleExpanded = useCallback(() => {
		if (isDisableCollapsed) {
			return;
		}
		setIsExpanded(prev => !prev);
	}, [isDisableCollapsed]);

	useEffect(() => {
		if (!innerListRef.current) {
			return;
		}

		const innerItemList = getChildren(innerListRef.current);
		const firstInnerItem = first(innerItemList);

		if (!firstInnerItem) {
			return;
		}

		const itemHeight = getHeight(firstInnerItem) + 4;
		const totalInner = isExpanded ? innerItemList.length : MAX_ITEM_PER_SCREEN;

		setContainerHeight(itemHeight * totalInner);
	}, [innerListRef, isExpanded]);

	return (
		<Presenter
			categoryBrandRankingItem={categoryBrandRankingItem}
			itemWidth={itemWidth}
			innerListRef={innerListRef}
			isExpanded={isExpanded}
			containerHeight={containerHeight}
			onExpanded={handleExpanded}
		/>
	);
};
CategoryBrandRankingItem.displayName = 'CategoryBrandRankingItem';
