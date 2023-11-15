import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useFeaturedContents } from './FeaturedContents.hooks';
import styles from './FeaturedContents.module.scss';

const WINDOW_SWITH_BORDER = 1150;

/**
 * Featured contents
 */
export const FeaturedContents: React.VFC = () => {
	const { featuredContents } = useFeaturedContents();
	const [addClassName, setAddClassName] = useState<'page1' | 'page2'>();

	// TODO: 現在静的コンテンツ精査中のため、対応後に削除
	useEffect(() => {
		const onResize = () => {
			setAddClassName(
				document.documentElement.clientWidth <= WINDOW_SWITH_BORDER
					? 'page1'
					: 'page2'
			);
		};
		onResize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<div
			className={classNames(styles.legacy, addClassName)}
			dangerouslySetInnerHTML={{ __html: featuredContents ?? '' }}
		/>
	);
};
FeaturedContents.displayName = 'FeaturedContents';
