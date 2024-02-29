import classNames from 'classnames';
import React, { MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StarRating.module.scss';

type Props = {
	rate?: string | number;
	size?: 'm' | 'l';
	className?: string;
	onClick?: (event: MouseEvent) => void;
};

/** Star rating component */
export const StarRating: React.VFC<Props> = ({
	rate = 0,
	size = 'm',
	className,
	onClick,
}) => {
	const [t] = useTranslation();

	const rateNumber = typeof rate === 'string' ? parseFloat(rate) : rate;

	/**
	 * Get the review rate style based on the given rate.
	 * @param {number} rate - The review rate.
	 * @returns {string} The review rate style in the format "integerNumber_decimalNumber".
	 */
	const reviewRateStyle = useMemo(() => {
		if (!rateNumber) {
			return `${size}star0`;
		}

		// Convert rate to a string with 1 decimal place
		const strRate = rateNumber.toFixed(1);

		// Split the rate into integer and decimal parts
		const rateArray = strRate.split('.');
		let integerNumber = 0;
		let decimalNumber = 0;

		// Get the integer part of the rate
		if (rateArray[0]) {
			integerNumber = Number(rateArray[0]);
		}

		// Get the decimal part of the rate
		if (rateArray[1]) {
			decimalNumber = Number(rateArray[1]);
		}

		if (decimalNumber >= 8) {
			// If the decimal part is X.8 or higher, round up the integer part and set the decimal part to 0
			integerNumber++;
			decimalNumber = 0;
		} else if (decimalNumber >= 4) {
			// If the decimal part is X.4 or higher but less than X.8, set the decimal part to 5
			decimalNumber = 5;
		} else {
			// If the decimal part is less than X.4, set the decimal part to 0
			decimalNumber = 0;
		}

		// Return the review rate style
		return `${size}star${integerNumber}${
			decimalNumber ? `dot${decimalNumber}` : ''
		}`;
	}, [rateNumber, size]);

	return (
		<span
			// title={
			// 	rateNumber
			// 		? t('components.ui.ratings.starRating.averageRating', {
			// 				rateNumber,
			// 		  })
			// 		: t('components.ui.ratings.starRating.noOneRated')
			// }
			onClick={onClick}
			className={classNames(styles.star, styles[reviewRateStyle], className)}
			data-size={size}
		>
			{rateNumber}
		</span>
	);
};
