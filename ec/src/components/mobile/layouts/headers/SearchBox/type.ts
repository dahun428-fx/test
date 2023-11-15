import { UrlObject } from 'url';

export type Suggestion = {
	label: string;
	href: string | UrlObject | undefined;
	onClick?: () => void;
};
