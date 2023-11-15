import { useMemo, VFC } from 'react';
import { DiscountIcon } from './DiscountIcon.svg';
import styles from './SeriesDiscount.module.scss';
import { Pict } from '@/models/api/msm/ect/series/shared';
import { discountRegex } from '@/utils/domain/pict';

type Props = {
	pictList?: Pict[];
	width?: number;
	height?: number;
};

/** Series discount component */
export const SeriesDiscount: VFC<Props> = ({
	pictList,
	width = 81,
	height = 28,
}) => {
	const discount = useMemo(() => {
		if (!pictList) {
			return;
		}
		const pict = pictList.find(pict => {
			if (!pict.pict) {
				return false;
			}

			return discountRegex.test(pict.pict);
		});
		if (!pict) {
			return;
		}
		const result = pict.pict?.match(discountRegex);
		return result && !isNaN(Number(result[1])) ? Number(result[1]) : undefined;
	}, [pictList]);

	if (discount === undefined || discount <= 0 || discount >= 100) {
		return null;
	}

	return (
		<span className={styles.container} style={{ width, height }}>
			<DiscountIcon discount={discount} height={height} />
		</span>
	);
};
SeriesDiscount.displayName = 'SeriesDiscount';
