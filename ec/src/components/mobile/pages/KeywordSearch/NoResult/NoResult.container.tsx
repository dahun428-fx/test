import React from 'react';
import { NoResult as Presenter } from './NoResult';
import { useSelector } from '@/store/hooks';
import { selectHitCountWithComboList } from '@/store/modules/pages/keywordSearch';

/**
 * No Search Result container
 */
export const NoResult: React.VFC = () => {
	const hitCount = useSelector(selectHitCountWithComboList);
	return <Presenter hitCount={hitCount} />;
};
NoResult.displayName = 'NoResult';
