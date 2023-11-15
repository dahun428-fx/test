import React from 'react';
import { useTooltip } from '@/components/pc/ui/tooltips';

type Props = {
	pict?: string;
	comment?: string;
};

/**
 * Pict component
 */
export const Pict: React.FC<Props> = ({ pict, comment }) => {
	const { bind } = useTooltip<HTMLDivElement>({
		content: comment,
		closeOnClick: true,
		theme: 'light',
	});
	if (!pict) {
		return null;
	}

	return <div {...bind}>{pict}</div>;
};
Pict.displayName = 'Pict';
