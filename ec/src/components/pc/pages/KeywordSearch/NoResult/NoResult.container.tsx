import React from 'react';
import { NoResult as Presenter } from './NoResult';
import { useSelector } from '@/store/hooks';
import { selectHitCount } from '@/store/modules/pages/keywordSearch';

/**
 * No Search Result container
 */
export const NoResult: React.VFC = () => {
	const hitCount = useSelector(selectHitCount);
	return <Presenter hitCount={hitCount} />;
};
NoResult.displayName = 'NoResult';
