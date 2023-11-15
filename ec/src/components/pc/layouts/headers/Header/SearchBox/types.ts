import { MouseEvent } from 'react';
import { UrlObject } from 'url';

export type Suggestion = {
	keyword: string;
	label?: string;
	href?: string | UrlObject;
	disabled?: boolean;
	onClick?: (event?: MouseEvent) => void;
	sendClickLog?: () => void;
	sendGAClickLog?: () => void;
	sendGAImpressionLog?: () => void;
};
