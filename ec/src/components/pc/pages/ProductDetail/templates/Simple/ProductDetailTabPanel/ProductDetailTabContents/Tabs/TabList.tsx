import React from 'react';
import { Tab } from './Tab';
import styles from './TabList.module.scss';
import { TabContent } from './types';

type Props = {
	tabList: TabContent[];
	value: string;
	onChange: (value: string) => void;
	onClickLink: (value: string) => void;
};

export const TabList: React.FC<Props> = ({
	tabList,
	value,
	onChange,
	onClickLink,
}) => {
	const handleClick = (value: string) => {
		onChange(value);
	};

	return (
		<ul className={styles.container}>
			{tabList.map(tab => (
				<Tab
					key={tab.value}
					value={tab.value}
					type={tab.type}
					href={tab.href}
					selected={tab.value === value}
					onClick={handleClick}
					onClickLink={onClickLink}
				>
					{tab.tab}
				</Tab>
			))}
		</ul>
	);
};
TabList.displayName = 'TabList';
