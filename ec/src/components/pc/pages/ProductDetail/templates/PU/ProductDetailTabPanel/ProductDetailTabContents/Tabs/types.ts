import { ReactNode } from 'react';

export type TabType = 'normal' | 'link';

export type TabContent = {
	value: string;
	type?: TabType;
	href?: string;
	tab: ReactNode;
};

export type Tab = TabContent & {
	panel: ReactNode;
};
