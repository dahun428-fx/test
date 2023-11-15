import React from 'react';
import { Tab } from './Tab';
import styles from './TabList.module.scss';
import { TabContent } from './types';

type Props = {
	tabList: TabContent[];
	value: string;
	onChange: (value: string) => void;
};

export const TabList: React.FC<Props> = ({ tabList, value, onChange }) => {
	const handleClick = (value: string) => {
		onChange(value);
	};

	return (
		<ul className={styles.container}>
			{tabList.map(tab => (
				<Tab
					key={tab.value}
					value={tab.value}
					href={tab.href}
					selected={tab.value === value}
					onClick={handleClick}
				>
					{tab.tab}
				</Tab>
			))}
		</ul>
	);
};
TabList.displayName = 'TabList';
