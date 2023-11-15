import React, { RefObject, useCallback } from 'react';
import { SpecPanel as Presenter } from './PartNumberBar';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectCurrentPartNumberList,
	selectCurrentPartNumberTotalCount,
	toggleShowsPartNumberListPanel,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/productDetail';

type Props = {
	partNumberBarRef: RefObject<HTMLDivElement>;
};

/**
 * Part number bar container
 */
export const PartNumberBar: React.VFC<Props> = ({ partNumberBarRef }) => {
	const partNumberList = useSelector(selectCurrentPartNumberList);
	const totalCount = useSelector(selectCurrentPartNumberTotalCount);
	const store = useStore();

	const handleClickPartNumberCount = useCallback(() => {
		toggleShowsSpecPanel(store)();
		toggleShowsPartNumberListPanel(store)();
	}, [store]);

	const handleClickConfigure = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	return (
		<Presenter
			partNumber={
				// 不本意だが ect-web-th の通り。型番確定したかではなく、1件になったかで表示制御される。
				partNumberList.length === 1 ? partNumberList[0]?.partNumber : undefined
			}
			totalCount={totalCount}
			partNumberBarRef={partNumberBarRef}
			onClickPartNumberCount={handleClickPartNumberCount}
			onClickConfigure={handleClickConfigure}
		/>
	);
};
PartNumberBar.displayName = 'PartNumberBar';
