import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRelatedKeyword } from './RelatedKeywordList.hooks';
import styles from './RelatedKeywordList.module.scss';
import { Link } from '@/components/pc/ui/links';
import { Flag } from '@/models/api/Flag';
import { pagesPath } from '@/utils/$path';

type Props = {
	/** className */
	className?: string;
};

/**
 * Other Related Keywords
 */
export const RelatedKeywordList: React.VFC<Props> = ({ className }) => {
	const { keywordList } = useRelatedKeyword() ?? {};

	const { t } = useTranslation();

	if (!keywordList?.length) {
		return null;
	}

	// TODO: under investigation remaining this module.
	return (
		<dl className={className}>
			<dt className={styles.title}>
				{t('pages.keywordSearch.relatedKeywordList.heading')}
			</dt>
			<dd className={styles.keywordListBox}>
				<ul>
					{keywordList.map((keyword, index) => (
						<li className={styles.keyword} key={index}>
							<Link
								href={pagesPath.vona2.result.$url({
									query: { Keyword: keyword, isReSearch: Flag.TRUE },
								})}
							>
								{keyword}
							</Link>
						</li>
					))}
				</ul>
			</dd>
		</dl>
	);
};
RelatedKeywordList.displayName = 'RelatedKeywordList';
