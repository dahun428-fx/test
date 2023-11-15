import React from 'react';
import styles from './CameleerContents.module.scss';

type Props = {
	title: string;
	// TODO: 要否は木村さんに確認中
	supplementaryMessage?: string;
	className?: string;
};

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
