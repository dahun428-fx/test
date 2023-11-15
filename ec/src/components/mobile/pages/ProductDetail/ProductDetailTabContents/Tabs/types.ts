import { ReactNode } from 'react';

export type TabContent = {
	value: string;
	href?: string;
	tab: ReactNode;
};

export type TabId = 'codeList' | 'catalog';
export type Tab = { tabId: TabId };
