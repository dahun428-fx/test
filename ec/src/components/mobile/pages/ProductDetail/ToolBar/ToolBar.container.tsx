import React, { useCallback } from 'react';
import { ToolBar as Presenter } from './ToolBar';
import { Flag } from '@/models/api/Flag';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectCompleteFlag,
	selectDigitalCatalog,
	selectPartNumberTotalCount,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/productDetail';

type Props = {
	className?: string;
};

export const ToolBar = React.memo<Props>(({ className }) => {
	const totalCount = useSelector(selectPartNumberTotalCount);
	const completeFlag = useSelector(selectCompleteFlag);
	const { digitalBookPdfUrl, misumiFlag } =
		useSelector(selectDigitalCatalog) ?? {};
	const store = useStore();

	const handleClickConfigure = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	// hide if part number completed
	if (Flag.isTrue(completeFlag)) {
		return null;
	}

	return (
		<Presenter
			className={className}
			totalCount={totalCount}
			misumiFlag={misumiFlag}
			digitalBookPdfUrl={digitalBookPdfUrl}
			onClickConfigure={handleClickConfigure}
		/>
	);
});
ToolBar.displayName = 'ToolBar';
