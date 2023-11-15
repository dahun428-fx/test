import { useState } from 'react';
import { Option as DisplayTypeOption } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';

export const useDisplayType = () => {
	const [displayType, setDisplayType] = useState<DisplayTypeOption>(
		DisplayTypeOption.LIST
	);

	return [displayType, setDisplayType] as const;
};
