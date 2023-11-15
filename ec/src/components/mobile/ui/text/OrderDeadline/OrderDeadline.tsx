import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderDeadline.module.scss';

type Props = {
	orderDeadline: string;
	className?: string;
};

/** Order limit time Text */
export const OrderDeadline: React.VFC<Props> = ({
	orderDeadline,
	className,
}) => {
	const { t } = useTranslation();
	return (
		<p className={classNames(className, styles.alert)}>
			{t('mobile.components.ui.text.orderDeadline.message', { orderDeadline })}
		</p>
	);
};
OrderDeadline.displayName = 'OrderDeadline';
