import classNames from 'classnames';
import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SaleLabel.module.scss';
import { config } from '@/config';
import { dateTime } from '@/utils/date';

type Props = {
	date: string;
	className?: string;
};

/** Sale label label component */
export const SaleLabel: VFC<Props> = ({ date, className }) => {
	const [t] = useTranslation();
	const formattedDate = dateTime(date, config.format.date);

	return (
		<span className={classNames(styles.sale, className)}>
			{t('mobile.components.domain.series.saleLabel.sale', {
				date: formattedDate,
			})}
		</span>
	);
};

SaleLabel.displayName = 'SaleLabel';
