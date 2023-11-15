import classNames from 'classnames';
import React from 'react';
import styles from './KeywordBanner.module.scss';
import { useSelector } from '@/store/hooks';
import { selectKeywordBanner } from '@/store/modules/pages/keywordSearch';

type Props = {
	className?: string;
};

export const KeywordBanner: React.VFC<Props> = ({ className }) => {
	const keywordBanner = useSelector(selectKeywordBanner);

	if (!keywordBanner?.bannerPath) {
		return null;
	}

	return (
		<div className={classNames(styles.banner, className)}>Keyword Banner</div>
	);
};
KeywordBanner.displayName = 'KeywordBanner';
