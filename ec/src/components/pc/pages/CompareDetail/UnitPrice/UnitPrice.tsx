import { Price } from '@/components/pc/ui/text/Price';
import styles from './UnitPrice.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
	currencyCode: string;
	standardUnitPrice?: number;
	campaignUnitPrice?: number;
	campaignEndDate?: string;
};

export const UnitPrice: React.VFC<Props> = ({
	currencyCode,
	campaignEndDate,
	campaignUnitPrice,
	standardUnitPrice,
}) => {
	const [t] = useTranslation();
	return (
		<>
			{!!campaignUnitPrice || !!campaignEndDate ? (
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
						value={
							campaignUnitPrice ??
							t('pages.compareDetail.unitPrice.specialPrice')
						}
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
