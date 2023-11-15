import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StorkList.module.scss';
import { Express } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { formatTime } from '@/utils/domain/express';
import { url } from '@/utils/url';

type Props = {
	expressList: Express[];
	theme?: 'standard' | 'simple';
	className?: string;
};

/** Stork list component */
export const StorkList: React.VFC<Props> = ({
	expressList,
	theme = 'standard',
	className,
}) => {
	const [t] = useTranslation();

	const getClassName = (className: string) => {
		return styles[
			`${theme}${className[0]?.toUpperCase()}${className.slice(1)}`
		];
	};

	return (
		<table
			summary="Express Service"
			className={classNames(getClassName('table'), className)}
		>
			<thead>
				<tr>
					<th colSpan={2} className={getClassName('header')}>
						{t('mobile.pages.productDetail.expressDelivery')}
						<a href={url.expressDeliveryService} target="guide">
							<span className={styles.question}>?</span>
						</a>
					</th>
				</tr>
			</thead>
			<tbody>
				{expressList.map(express => (
					<tr key={express.expressType}>
						<td className={getClassName('valueCell')}>
							({express.expressTypeDisp})
						</td>
						<td className={getClassName('valueCell')}>
							{formatTime(express.expressDeadline, t)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
StorkList.displayName = 'StorkList';
