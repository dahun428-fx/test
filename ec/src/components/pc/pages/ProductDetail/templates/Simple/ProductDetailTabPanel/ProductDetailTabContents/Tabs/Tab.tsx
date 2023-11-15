import React from 'react';
import styles from './Tab.module.scss';
import { TabType } from './types';

type Props = {
	value: string;
	type?: TabType;
	href?: string;
	selected: boolean;
	onClick: (value: string) => void;
	onClickLink: (value: string) => void;
};

export const Tab: React.FC<Props> = ({
	value,
	type = 'normal',
	href = '',
	selected,
	onClick,
	onClickLink,
	children,
}) => {
	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		onClick(value);
	};

	return (
		<li className={styles.tab}>
			{type === 'link' ? (
				<a
					href={href}
					rel="noreferrer"
					target="_blank"
					className={styles.content}
					onClick={() => onClickLink(value)}
				>
					{children}
				</a>
			) : (
				<a
					href={href}
					className={styles.content}
					aria-selected={selected}
					role="tab"
					onClick={handleClick}
				>
					{children}
				</a>
			)}
		</li>
	);
};
Tab.displayName = 'Tab';
