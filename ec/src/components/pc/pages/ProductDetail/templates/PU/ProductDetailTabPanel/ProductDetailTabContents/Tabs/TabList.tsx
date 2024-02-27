import React, { useCallback, useEffect, useState } from 'react';
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
	const [offsetY, setOffsetY] = useState(0);

	const handleClick = (value: string) => onChange(value);

	const onScroll = useCallback(() => {
		setOffsetY(
			document.getElementById('actionsPanel')?.getBoundingClientRect().bottom ??
				0
		);
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	return (
		<ul className={styles.container} style={{ top: `${offsetY}px` }}>
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
