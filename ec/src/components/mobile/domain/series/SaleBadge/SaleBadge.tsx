import React, { VFC } from 'react';
import styles from './SaleBadge.module.scss';

/** Sale badge label component */
export const SaleBadge: VFC = () => {
	return <span className={styles.label} />;
};

SaleBadge.displayName = 'SaleBadge';
