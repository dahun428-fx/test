import classNames from 'classnames';
import Image from 'next/image';
import { VFC } from 'react';
import styles from './RecommendDaysToShip.module.scss';
import truckImage from './assets/images/truck.svg';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';

export type Props = {
	/** 最小通常出荷日数 */
	minDaysToShip?: number;
	/** 最大通常出荷日数 */
	maxDaysToShip?: number;
	className?: string;
	verticalAlign?: 'bottom' | 'center';
};

/**
 * モバイル画面の商品レコメンド用の出荷日数表示文言
 */
export const RecommendDaysToShip: VFC<Props> = ({
	minDaysToShip,
	maxDaysToShip,
	className,
	verticalAlign = 'center',
}) => {
	return (
		<div
			className={classNames(styles.daysToShip, className, {
				[String(styles.daysToShipBottom)]: verticalAlign === 'bottom',
			})}
		>
			<Image src={truckImage} width={24} height={24} alt="days to ship" />
			<DaysToShip
				className={styles.text}
				minDaysToShip={minDaysToShip}
				maxDaysToShip={maxDaysToShip}
			/>
		</div>
	);
};
RecommendDaysToShip.displayName = 'RecommendDaysToShip';
