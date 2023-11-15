import React from 'react';
import styles from './CameleerContents.module.scss';

type Props = {
	title: string;
	supplementaryMessage?: string;
	className?: string;
};

/** Cameleer contents component */
export const CameleerContents: React.FC<Props> = ({
	title,
	children,
	className,
}) => {
	return (
		<div className={className}>
			<div className={styles.titleContents}>
				<h2 className={styles.title}>{title}</h2>
			</div>
			<div className={styles.cameleerContents}>{children}</div>
		</div>
	);
};
CameleerContents.displayName = 'CameleerContents';
