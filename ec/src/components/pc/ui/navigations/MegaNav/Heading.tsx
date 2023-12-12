import React from 'react';
import styles from './Heading.module.scss';

/**
 * Heading item for Mega Navigation
 */
export const Heading: React.FC = ({ children }) => {
	return <h4 className={styles.heading}>{children}</h4>;
};
Heading.displayName = 'Heading';
