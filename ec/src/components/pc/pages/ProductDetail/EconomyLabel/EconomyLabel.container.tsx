import React from 'react';
import { EconomyLabel as Presenter } from '@/components/pc/ui/labels';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

type Props = {
	className?: string;
};

export const EconomyLabel: React.VFC<Props> = ({ className }) => {
	const { cValueFlag } = useSelector(selectSeries);

	if (Flag.isFalse(cValueFlag)) {
		return null;
	}
	return <Presenter className={className} />;
};
EconomyLabel.displayName = 'EconomyLabel';
