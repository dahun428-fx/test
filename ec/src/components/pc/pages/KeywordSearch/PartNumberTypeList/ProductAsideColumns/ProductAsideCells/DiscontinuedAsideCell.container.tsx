import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { DiscontinuedAsideCell as Presenter } from './DiscontinuedAsideCell';
import { ectLogger } from '@/logs/ectLogger';
import { getOneParams } from '@/utils/query';

type Props = {
	discontinuedDate?: string;
	alternativeMessage?: string;
	index: number;
};

/** Discontinued aside cell container */
export const DiscontinuedAsideCell: React.VFC<Props> = ({
	index,
	...props
}) => {
	const router = useRouter();
	const { isReSearch, Keyword: keyword } = getOneParams(
		router.query,
		...['isReSearch', 'Keyword']
	);

	const handleClickAlternativeLink = useCallback(
		(href: string) => {
			if (!keyword) {
				return;
			}

			ectLogger.searchResult.clickAlternativeLink({
				keyword,
				isReSearch,
				forwardPageUrl: href,
				forwardPageUrlDispNo: String(index + 1),
			});
		},
		[index, isReSearch, keyword]
	);

	return (
		<Presenter {...props} onClickAlternativeLink={handleClickAlternativeLink} />
	);
};

DiscontinuedAsideCell.displayName = 'DiscontinuedAsideCell';
