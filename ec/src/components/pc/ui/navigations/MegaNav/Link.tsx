import React from 'react';
import styles from './Link.module.scss';
import { Link as CommonLink } from '@/components/pc/ui/links';

type Props = {
	/** href */
	href: string;
	onClick: () => void;
};

/**
 * Link item for Mega Navigation
 */
export const Link: React.FC<Props> = ({ href, onClick, children }) => {
	return (
		<CommonLink href={href} className={styles.link} onClick={onClick}>
			{children}
		</CommonLink>
	);
};
Link.displayName = 'Link';
