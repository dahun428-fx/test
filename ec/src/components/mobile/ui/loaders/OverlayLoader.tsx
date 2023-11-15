import React, { VFC } from 'react';
import styles from './Overlayloader.module.scss';

/**
 * Overlay loader component
 */
export const OverlayLoader: VFC = () => {
	return (
		<div className={styles.overlayLoader}>
			<div className={styles.loader} />
		</div>
	);
};

OverlayLoader.displayName = 'OverlayLoader';
