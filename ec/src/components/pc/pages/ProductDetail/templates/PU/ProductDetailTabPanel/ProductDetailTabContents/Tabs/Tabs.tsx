import React from 'react';
import { TabList } from './TabList';
import { TabPanel } from './TabPanel';
import styles from './Tabs.module.scss';
import { Tab } from './types';

type Props = {
	tabList: Tab[];
	value: string;
	onChange: (value: string) => void;
	onClickLink: (value: string) => void;
};

export const Tabs: React.VFC<Props> = ({
	tabList,
	value,
	onChange,
	onClickLink,
}) => {
	return (
		<>
			<TabList
				tabList={tabList.map(tab => ({
					value: tab.value,
					type: tab.type,
					href: tab.href,
					tab: tab.tab,
				}))}
				value={value}
				onChange={onChange}
				onClickLink={onClickLink}
			/>
			<div className={styles.panel}>
				{tabList.map(tab => (
					<TabPanel
						key={tab.value}
						hidden={tab.value !== value}
						contentParentId={`${tab.value}-tabPanelContents`}
					>
						{tab.panel}
					</TabPanel>
				))}
			</div>
		</>
	);
};
Tabs.displayName = 'Tabs';
