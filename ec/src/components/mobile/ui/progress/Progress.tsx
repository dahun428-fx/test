import React from 'react';
import styles from './Progress.module.scss';

export type Props = {
	step: number;
	maxStep: number;
};

/**
 * Progress bar
 */
export const Progress: React.VFC<Props> = ({ step, maxStep }) => {
	const width = `${Math.round((step / maxStep) * 100)}%`;

	return (
		<div className={styles.rail}>
			<div className={styles.progress} style={{ width }} />
		</div>
	);
};
Progress.displayName = 'Progress';
