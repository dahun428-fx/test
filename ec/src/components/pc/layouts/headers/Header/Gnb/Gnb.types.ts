export type GnbItem = {
	id?: string;
	idx?: number;
	link: string;
	label: string;
	isNew?: boolean;
	childrenList?: GnbItem[];
};
