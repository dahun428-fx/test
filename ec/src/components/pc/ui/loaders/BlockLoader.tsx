import classNames from 'classnames';
import React from 'react';
import styles from './BlockLoader.module.scss';

type Props = {
	className?: string;
	hideLoadingText?: boolean;
};

/**
 * Block loader
 */
export const BlockLoader: React.VFC<Props> = ({
	className,
	hideLoadingText,
}) => {
	return (
		<div
			className={classNames(styles.loader, className, {
				[String(styles.hideLoadingText)]: hideLoadingText,
			})}
		>
			Loading...
		</div>
	);
};
BlockLoader.displayName = 'BlockLoader';
