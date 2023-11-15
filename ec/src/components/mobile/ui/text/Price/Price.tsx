import React, { useMemo } from 'react';
import styles from './Price.module.scss';
import { useCurrencyContext } from './context';
import { format } from './helper';
import { Logger } from '@/logs/datadog';

export type Theme = 'standard' | 'accent';

export type Props = {
	/** price value */
	value: number | string | undefined;
	/** currency code */
	ccyCode?: string;
	/** symbol less? */
	symbolLess?: boolean;
	/** class name */
	className?: string;
	/** no value fallback */
	fallback?: string;
	/** theme */
	theme?: Theme;
	/**
	 * numeric class name
	 * NOTE: numeric part styling class of price
	 */
	numericClassName?: string;
};

/**
 * Price
 */
export const Price: React.VFC<Props> = ({
	ccyCode: specifiedCcyCode,
	...rest
}) => {
	const providedCcyCode = useCurrencyContext();
	const ccyCode = specifiedCcyCode ?? providedCcyCode;

	const Component = ccyCode ? prices[ccyCode] ?? FallbackPrice : FallbackPrice;
	if (Component === FallbackPrice) {
		Logger.error(
			`The Price component for a specified currency code is not yet implemented. [ccyCode=${ccyCode}, value=${rest.value}]`
		);
	}

	if (rest.value == null || rest.value === '' || rest.value <= 0) {
		return <>{rest.fallback ?? '---'}</>;
	}

	return <Component {...rest} />;
};
Price.displayName = 'Price';

type CurrencyProps = Omit<Props, 'ccyCode'>;

/**
 * currency code: MYR
 */
export const MYR: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	theme = 'standard',
	numericClassName,
}) => {
	const digits = 2;
	const symbol = 'MYR';
	const price = useMemo(() => format(value, digits), [value]);

	if (theme === 'standard') {
		return (
			<span className={className}>
				{price && !symbolLess && `${symbol} `}
				{price}
			</span>
		);
	}
	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={numericClassName ?? styles.accentPrice}>{price}</span>
		</span>
	);
};

/**
 * currency code: USD
 */
export const USD: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	theme = 'standard',
}) => {
	const digits = 2;
	const symbol = 'USD';
	const price = useMemo(() => format(value, digits), [value]);

	if (theme === 'standard') {
		return (
			<span className={className}>
				{price && !symbolLess && `${symbol} `}
				{price}
			</span>
		);
	}
	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={styles.accentPrice}>{price}</span>
		</span>
	);
};

/**
 * currency code: SGD
 */
export const SGD: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	theme = 'standard',
}) => {
	const digits = 2;
	const symbol = 'SGD';
	const price = useMemo(() => format(value, digits), [value]);

	if (theme === 'standard') {
		return (
			<span className={className}>
				{price && !symbolLess && `${symbol} `}
				{price}
			</span>
		);
	}
	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={styles.accentPrice}>{price}</span>
		</span>
	);
};

/** Fallback price */
const FallbackPrice: React.VFC<CurrencyProps> = ({
	value,
	className,
	theme = 'standard',
}) => {
	const digits = 2;
	const price = useMemo(() => format(value, digits), [value]);

	if (theme === 'standard') {
		return <span className={className}>{price}</span>;
	}

	return (
		<span className={className}>
			<span className={styles.accentPrice}>{price}</span>
		</span>
	);
};

/**
 * Price records in currency units.
 */
const prices: Record<string, React.VFC<CurrencyProps>> = {
	MYR,
	USD,
	SGD,
} as const;
