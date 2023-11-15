import classNames from 'classnames';
import React from 'react';
import styles from './PageHeading.module.scss';

type Props = {
	className?: string;
};

/**
 * Page Heading
 */
export const PageHeading: React.FC<Props> = ({ children, className }) => {
	return <h1 className={classNames(styles.heading, className)}>{children}</h1>;
};
PageHeading.displayName = 'PageHeading';
