import Image from 'next/image';
import React from 'react';
import SaleIcon from './assets/images/sale.png';

export type Props = {
	className?: string;
};

/**
 * Sale label Component.
 */
export const SaleLabel: React.FC<Props> = ({ className }) => {
	return <Image src={SaleIcon} alt="sale" className={className} />;
};
SaleLabel.displayName = 'SaleLabel';
