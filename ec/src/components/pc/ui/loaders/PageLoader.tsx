import React from 'react';
import { BlockLoader } from './BlockLoader';
import styles from './PageLoader.module.scss';

/**
 * Page loader
 * - has 100vh height container for CLS of Core Web Vitals
 */
export const PageLoader: React.VFC = () => {
	return (
		<div className={styles.container}>
			<BlockLoader className={styles.loader} />
		</div>
	);
};
PageLoader.displayName = 'PageLoader';
