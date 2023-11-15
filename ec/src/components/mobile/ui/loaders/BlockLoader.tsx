import classnames from 'classnames';
import React from 'react';
import styles from './BlockLoader.module.scss';

type Props = {
	className?: string;
};

/**
 * Block loader
 */
export const BlockLoader: React.VFC<Props> = ({ className }) => {
	return <div className={classnames(styles.loader, className)} />;
};
BlockLoader.displayName = 'BlockLoader';
