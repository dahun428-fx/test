import React, { VFC } from 'react';
import styles from './UniversalLoader.module.scss';

/**
 * Universal loader component
 */
export const UniversalLoader: VFC = () => {
	return (
		<div className={styles.overlay}>
			<div className={styles.loader}>Loading...</div>
		</div>
	);
};

UniversalLoader.displayName = 'UniversalLoader';
