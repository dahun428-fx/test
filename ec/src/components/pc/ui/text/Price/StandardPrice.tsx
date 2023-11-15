import React from 'react';
import { Price, Theme } from './Price';
import styles from './StandardPrice.module.scss';

type Props = {
	minStandardUnitPrice?: number;
	maxStandardUnitPrice?: number;
	ccyCode?: string;
	suffix?: string;
	theme?: Theme;
	strike?: boolean;
};

export const StandardPrice: React.VFC<Props> = ({
	minStandardUnitPrice,
	maxStandardUnitPrice = minStandardUnitPrice,
	ccyCode,
	suffix = ' -',
	theme,
	strike,
}) => {
	if (!minStandardUnitPrice || minStandardUnitPrice < 0) {
		return <span className={styles.empty}>-</span>;
	}

	if (minStandardUnitPrice === maxStandardUnitPrice) {
		return (
			<Price
				value={minStandardUnitPrice}
				ccyCode={ccyCode}
				theme={theme}
				strike={strike}
			/>
		);
	}

	return (
		<>
			<Price
				value={minStandardUnitPrice}
				ccyCode={ccyCode}
				theme={theme}
				strike={strike}
			/>
			{suffix}
		</>
	);
};
StandardPrice.displayName = 'StandardPrice';
