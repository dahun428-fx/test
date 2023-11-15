import React from 'react';
import styles from './Section.module.scss';

type Props = {
	heading: string;
};

/** Section component */
export const Section: React.FC<Props> = ({ heading, children }) => {
	return (
		<div>
			<h2 className={styles.heading}>{heading}</h2>
			<div className={styles.content}>{children}</div>
		</div>
	);
};
Section.displayName = 'Section';
