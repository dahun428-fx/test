import React from 'react';
import styles from './CommonListSpec.module.scss';
import { SpecHeading } from '@/components/mobile/ui/headings/SpecHeading';

type Props = { title: string };

/**
 * Common list spec component
 */
export const CommonListSpec: React.FC<Props> = ({ title, children }) => {
	return (
		<div className={styles.container}>
			<SpecHeading>{title}</SpecHeading>
			{children}
		</div>
	);
};
CommonListSpec.displayName = 'CommonListSpec';
