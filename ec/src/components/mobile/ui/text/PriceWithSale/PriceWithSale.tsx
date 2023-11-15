import classNames from 'classnames';
import { Trans } from 'react-i18next';
import styles from './PriceWithSale.module.scss';
import { Price, Theme } from '@/components/mobile/ui/text/Price';
import { Flag } from '@/models/api/Flag';

type Props = {
	standardUnitPrice?: number;
	unitPrice?: number;
	campaignApplyFlag?: Flag;
	currencyCode?: string;
	theme?: Theme;
	showsSaleOff?: boolean;
};

/** Price with sale */
export const PriceWithSale: React.VFC<Props> = ({
	standardUnitPrice,
	unitPrice,
	campaignApplyFlag,
	currencyCode,
	theme,
	showsSaleOff = true,
}) => {
	/** Price sale or not */
	const isSale =
		unitPrice && standardUnitPrice && unitPrice < standardUnitPrice;

	if (!unitPrice) {
		return <span>---</span>;
	}

	if (isSale && Flag.isTrue(campaignApplyFlag) && standardUnitPrice) {
		return (
			<>
				<Price
					value={standardUnitPrice}
					ccyCode={currencyCode}
					className={styles.strike}
				/>
				<br />
				<Price
					value={unitPrice}
					ccyCode={currencyCode}
					theme={theme}
					className={classNames(styles.isSale, styles.unitPriceSale)}
				/>
				{showsSaleOff && (
					<>
						<br />
						<span className={styles.isSale}>
							<Trans i18nKey="mobile.components.ui.text.priceWithSale.saleOff">
								<Price
									value={(standardUnitPrice - unitPrice).toFixed(2)}
									ccyCode={currencyCode}
								/>
							</Trans>
						</span>
					</>
				)}
			</>
		);
	}

	return <Price value={unitPrice} ccyCode={currencyCode} theme={theme} />;
};

PriceWithSale.displayName = 'PriceWithSale';
