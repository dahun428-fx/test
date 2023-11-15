import { action } from '@storybook/addon-actions';
import { ComponentStoryObj, Meta } from '@storybook/react';
import { PurchaseConditions } from './PurchaseConditions';
import { createPrice } from './PurchaseConditions.mocks';
import { CurrencyProvider } from '@/components/mobile/ui/text/Price';
import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';

type Story = ComponentStoryObj<typeof PurchaseConditions>;

const price = createPrice();

export default {
	component: PurchaseConditions,
	args: {
		price,
		quote: action('Quote on WOS'),
		disableQuote: false,
	},
	decorators: [
		story => (
			<div style={{ minWidth: 360, maxWidth: 450 }}>
				<CurrencyProvider ccyCode="MYR">{story()}</CurrencyProvider>
			</div>
		),
	],
} as Meta<typeof PurchaseConditions>;

export const _Default: Story = {
	args: { price: createPrice() },
};

export const _OrderDeadline: Story = {
	args: { price: createPrice({ orderDeadline: '15:00' }) },
};

export const _Discount: Story = {
	args: { price: createPrice({ standardUnitPrice: 900.25 }) },
};

export const _SameDayShipping: Story = {
	args: { price: createPrice({ daysToShip: 0 }) },
};

export const _OutOfSpecific: Story = {
	args: {
		price: createPrice({
			unfitType: UnfitType.NonstandardUnfit,
			volumeDiscountList: [],
		}),
	},
};

export const _BigOrder: Story = {
	args: { price: createPrice({ largeOrderMaxQuantity: 100 }) },
};

export const _PriceAndLeadTimeNeedsQuote = {
	args: {
		price: createPrice({
			priceInquiryFlag: Flag.TRUE,
			daysToShipInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const _PriceNeedsQuote = {
	args: {
		price: createPrice({
			priceInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const _LeadTimeNeedsQuote = {
	args: {
		price: createPrice({
			daysToShipInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const _DisableQuote = {
	args: {
		price: createPrice({
			daysToShipInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
		disableQuote: true,
	},
};
