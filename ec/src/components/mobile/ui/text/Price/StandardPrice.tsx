import React from 'react';
import { Price, Theme } from './Price';
import styles from './StandardPrice.module.scss';

type Props = {
	minStandardUnitPrice?: number;
	maxStandardUnitPrice?: number;
	ccyCode?: string;
	suffix?: string;
	theme?: Theme;
	className?: string;
};

export const StandardPrice: React.VFC<Props> = ({
	minStandardUnitPrice,
	maxStandardUnitPrice = minStandardUnitPrice,
	ccyCode,
	suffix = '-',
	theme,
	className,
}) => {
	if (!minStandardUnitPrice) {
		return <span className={styles.empty}>-</span>;
	}

	if (minStandardUnitPrice === maxStandardUnitPrice) {
		return (
			<Price
				value={minStandardUnitPrice}
				ccyCode={ccyCode}
				theme={theme}
				className={className}
			/>
		);
	}

	return (
		<>
			<Price
				value={minStandardUnitPrice}
				ccyCode={ccyCode}
				theme={theme}
				className={className}
			/>
			{suffix}
		</>
	);
};
StandardPrice.displayName = 'StandardPrice';
