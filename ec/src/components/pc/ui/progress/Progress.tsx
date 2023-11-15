import classNames from 'classnames';
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
		<div className={styles.tube}>
			<div
				className={classNames(styles.progress, {
					[String(styles.full)]: step === maxStep,
				})}
				style={{ width: width }}
			/>
		</div>
	);
};
Progress.displayName = 'Progress';
