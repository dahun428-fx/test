import { Price } from '@/components/pc/ui/text/Price';
import styles from './UnitPrice.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
	currencyCode: string;
	standardUnitPrice?: number;
	unitPrice?: number;
};

export const UnitPrice: React.VFC<Props> = ({
	standardUnitPrice,
	unitPrice,
	currencyCode,
}) => {
	const [t] = useTranslation();

	if (unitPrice == null || unitPrice === 0) {
		return <span>-</span>;
	}
	return (
		<>
			{standardUnitPrice && standardUnitPrice > unitPrice ? (
				<>
					<span className={styles.ccDef}>
						<Price
							value={standardUnitPrice}
							strike={true}
							theme="accent"
							ccyCode={currencyCode}
						/>
					</span>
					<br />
					<Price
						value={unitPrice ?? t('pages.compareDetail.unitPrice.specialPrice')}
						isRed={true}
						theme="standard"
						ccyCode={currencyCode}
					/>
				</>
			) : (
				<>
					<Price
						value={standardUnitPrice}
						theme="standard"
						ccyCode={currencyCode}
						emptySentence="-"
					/>
				</>
			)}
		</>
	);
};
UnitPrice.displayName = 'UnitPrice';
