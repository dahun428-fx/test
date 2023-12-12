import React from 'react';
import styles from './Heading.module.scss';

/**
 * Heading item for Mega Navigation
 */
export const Heading: React.FC = ({ children }) => {
	return <h3 className={styles.heading}>{children}</h3>;
};
Heading.displayName = 'Heading';
