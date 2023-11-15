import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './Price.module.scss';
import { useCurrencyContext } from './context';
import { format } from './helper';
import { Logger } from '@/logs/datadog';

export type Theme = 'standard' | 'accent' | 'medium-accent' | 'large-accent';

export type Props = {
	/** price value */
	value: number | string | undefined;
	/** currency code */
	ccyCode?: string;
	/** symbol less? */
	symbolLess?: boolean;
	/** class name */
	className?: string;
	/** theme */
	theme?: Theme;
	/** empty sentence */
	emptySentence?: string;
	/** class name for empty sentence */
	emptySentenceClassName?: string;
	/** Number shown in red? */
	isRed?: boolean;
	/** strike line shown? */
	strike?: boolean;
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

	if (!rest.value) {
		return rest.emptySentence ? (
			<span className={rest.emptySentenceClassName}>{rest.emptySentence}</span>
		) : null;
	}

	return <Component {...rest} />;
};
Price.displayName = 'Price';

type CurrencyProps = Omit<Props, 'ccyCode'>;

/**
 * currency code: MYR
 */
const MYR: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	isRed = false,
	strike = false,
	theme = 'standard',
}) => {
	const digits = 2;
	const symbol = 'MYR';
	const price = useMemo(() => format(value, digits), [value]);

	if (
		theme === 'accent' ||
		theme === 'medium-accent' ||
		theme === 'large-accent'
	) {
		return (
			<span className={className}>
				{price && !symbolLess && (
					<span
						className={classNames(styles.symbol, {
							[String(styles.strike)]: strike,
						})}
					>
						{symbol}
					</span>
				)}
				<span
					className={classNames({
						[String(styles.accent)]: theme === 'accent',
						[String(styles.mediumAccent)]: theme === 'medium-accent',
						[String(styles.largeAccent)]: theme === 'large-accent',
						[String(styles.isRed)]: isRed,
						[String(styles.strike)]: strike,
					})}
				>
					{price}
				</span>
			</span>
		);
	}

	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={classNames({ [String(styles.isRed)]: isRed })}>
				{price}
			</span>
		</span>
	);
};

/**
 * currency code: USD
 */
const USD: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	isRed = false,
	strike = false,
	theme = 'standard',
}) => {
	const digits = 2;
	const symbol = 'USD';
	const price = useMemo(() => format(value, digits), [value]);

	if (
		theme === 'accent' ||
		theme === 'medium-accent' ||
		theme === 'large-accent'
	) {
		return (
			<span className={className}>
				{price && !symbolLess && (
					<span
						className={classNames(styles.symbol, {
							[String(styles.strike)]: strike,
						})}
					>
						{symbol}
					</span>
				)}
				<span
					className={classNames({
						[String(styles.accent)]: theme === 'accent',
						[String(styles.mediumAccent)]: theme === 'medium-accent',
						[String(styles.largeAccent)]: theme === 'large-accent',
						[String(styles.isRed)]: isRed,
						[String(styles.strike)]: strike,
					})}
				>
					{price}
				</span>
			</span>
		);
	}

	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={classNames({ [String(styles.isRed)]: isRed })}>
				{price}
			</span>
		</span>
	);
};

/**
 * currency code: SGD
 */
const SGD: React.VFC<CurrencyProps> = ({
	value,
	symbolLess,
	className,
	isRed = false,
	strike = false,
	theme = 'standard',
}) => {
	const digits = 2;
	const symbol = 'SGD';
	const price = useMemo(() => format(value, digits), [value]);

	if (
		theme === 'accent' ||
		theme === 'medium-accent' ||
		theme === 'large-accent'
	) {
		return (
			<span className={className}>
				{price && !symbolLess && (
					<span
						className={classNames(styles.symbol, {
							[String(styles.strike)]: strike,
						})}
					>
						{symbol}
					</span>
				)}
				<span
					className={classNames({
						[String(styles.accent)]: theme === 'accent',
						[String(styles.mediumAccent)]: theme === 'medium-accent',
						[String(styles.largeAccent)]: theme === 'large-accent',
						[String(styles.isRed)]: isRed,
						[String(styles.strike)]: strike,
					})}
				>
					{price}
				</span>
			</span>
		);
	}

	return (
		<span className={className}>
			{price && !symbolLess && `${symbol} `}
			<span className={classNames({ [String(styles.isRed)]: isRed })}>
				{price}
			</span>
		</span>
	);
};

/** Fallback price */
const FallbackPrice: React.VFC<CurrencyProps> = ({
	value,
	className,
	isRed = false,
	strike = false,
	theme = 'standard',
}) => {
	const digits = 2;
	const price = useMemo(() => format(value, digits), [value]);

	if (
		theme === 'accent' ||
		theme === 'medium-accent' ||
		theme === 'large-accent'
	) {
		return (
			<span className={className}>
				<span
					className={classNames({
						[String(styles.accent)]: theme === 'accent',
						[String(styles.mediumAccent)]: theme === 'medium-accent',
						[String(styles.largeAccent)]: theme === 'large-accent',
						[String(styles.isRed)]: isRed,
						[String(styles.strike)]: strike,
					})}
				>
					{price}
				</span>
			</span>
		);
	}

	return (
		<span className={className}>
			<span className={classNames({ [String(styles.isRed)]: isRed })}>
				{price}
			</span>
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
