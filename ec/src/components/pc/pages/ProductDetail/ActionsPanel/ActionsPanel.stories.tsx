import { ComponentStoryObj, Meta } from '@storybook/react';
import { ActionsPanel } from './ActionsPanel';
import { createPrice } from './ActionsPanel.mocks';
import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';

type Story = ComponentStoryObj<typeof ActionsPanel>;

const product = {
	completeFlag: Flag.TRUE,
	partNumber: 'PSCS5-8',
	brandCode: 'MSM1',
	seriesCode: '110302636410',
	categoryName: 'Shaft Collars',
	categoryCodeList: ['mech', 'M0100000000', 'M0103000000'],
	similarSpecList: [],
	displayStandardPriceFlag: Flag.FALSE,
};

export default {
	component: ActionsPanel,
	args: {
		quantity: 1,
		product,
		checkable: true,
		checking: false,
		checkPrice: async () => {
			// noop
		},
		authenticated: true,
		isEcUser: false,
	},
} as Meta<typeof ActionsPanel>;

export const Default: Story = {};

export const PiecesPerPackage: Story = {
	args: { product: { ...product, piecesPerPackage: 30 } },
};

export const Loading: Story = {
	args: { loading: true },
};

export const NotLoggedIn: Story = {
	args: { showsCheck: false, authenticated: false, price: createPrice() },
};

export const CheckedPrice: Story = {
	args: { showsCheck: false, price: createPrice() },
};

export const PiecesPerPackageAfterCheck: Story = {
	args: {
		product: { ...product, piecesPerPackage: 30 },
		price: createPrice({ piecesPerPackage: 30, content: undefined }),
	},
};

// TODO: implement
// export const StorkList: Story = {
// 	args: {
// 		price: createPrice({
// 			expressList: [
// 				{
// 					expressType: 'T0',
// 					expressTypeDisp: 'Express T',
// 					chargeType: '1',
// 					charge: 200,
// 					expressDeadline: '12:00',
// 				},
// 				{
// 					expressType: 'A0',
// 					expressTypeDisp: 'Express A',
// 					chargeType: '1',
// 					charge: 200,
// 					expressDeadline: '15:00',
// 				},
// 				{
// 					expressType: 'B0',
// 					expressTypeDisp: 'Express B',
// 					chargeType: '2',
// 					charge: 200,
// 					expressDeadline: '3:00',
// 				},
// 				{
// 					expressType: 'C0',
// 					expressTypeDisp: 'Express C',
// 					chargeType: '2',
// 					charge: 100,
// 					expressDeadline: '20:00',
// 				},
// 			],
// 		}),
// 	},
// };

export const OrderDeadline: Story = {
	args: { price: createPrice({ orderDeadline: '15:00' }) },
};

export const Discount: Story = {
	args: { price: createPrice({ standardUnitPrice: 900.25 }) },
};

export const SameDayShipping: Story = {
	args: { price: createPrice({ daysToShip: 0 }) },
};

export const OutOfSpecific: Story = {
	args: {
		price: createPrice({
			unfitType: UnfitType.NonstandardUnfit,
			volumeDiscountList: [],
		}),
	},
};

export const BigOrder: Story = {
	args: { price: createPrice({ largeOrderMaxQuantity: 100 }) },
};

export const PriceAndLeadTimeNeedsQuote = {
	args: {
		price: createPrice({
			priceInquiryFlag: Flag.TRUE,
			daysToShipInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const PriceNeedsQuote = {
	args: {
		price: createPrice({
			priceInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const LeadTimeNeedsQuote = {
	args: {
		price: createPrice({
			daysToShipInquiryFlag: Flag.TRUE,
			volumeDiscountList: [],
		}),
	},
};

export const PartNumberMessageList = {
	args: {
		product: {
			...product,
			minQuantity: 10,
			piecesPerPackage: 4,
			cautionList: [
				'Please select the value for parameter No. 5 from the following 60 90 120.',
			],
			noticeList: [
				'Please select the value for parameter No. 5 from the following 60 90 120.',
			],
		},
		price: createPrice({
			orderDeadline: '15:00',
			minQuantity: 10,
			piecesPerPackage: 30,
		}),
	},
};

export const SimilarProducts = {
	args: {
		product: {
			...product,
			similarSpecList: [
				{
					similarSearchType: '2',
					specCode: '00000346313',
					specCodeDisp: 'C1',
					specName: 'Fastening Method',
					specValue: 'b',
					specValueDisp: 'Clamp',
				},
				{
					similarSearchType: '2',
					specCode: '00000004075',
					specCodeDisp: 'C2',
					specName: 'Specifications',
					specValue: 'a',
					specValueDisp: 'Standard',
				},
				{
					similarSearchType: '2',
					specCode: '00000004080',
					specCodeDisp: 'C7',
					specName: 'I.D.',
					specValue: 'mig00000001808076',
					specValueDisp: '5',
				},
				{
					similarSearchType: '2',
					specCode: '00000004081',
					specCodeDisp: 'C8',
					specName: 'O.D.',
					specValue: 'mig00000001801365',
					specValueDisp: '20',
				},
				{
					similarSearchType: '2',
					specCode: '00000004082',
					specCodeDisp: 'C9',
					specName: 'Width',
					specValue: 'mig00000001800775',
					specValueDisp: '8',
				},
				{
					similarSearchType: '2',
					specCode: '00000004078',
					specCodeDisp: 'C5',
					specName: 'Material',
					specValue: 'a',
					specValueDisp: 'S45C Equivalent',
				},
				{
					similarSearchType: '2',
					specCode: '00000004079',
					specCodeDisp: 'C6',
					specName: 'Surface Treatment',
					specValue: '00000004079.b!00003',
					specValueDisp: '[Surface Treatment] Electroless Nickel Plating',
				},
				{
					similarSearchType: '2',
					specCode: '00000004077',
					specCodeDisp: 'C4',
					specName: 'Thickness',
					specValue: 'a',
					specValueDisp: 'Standard Type',
				},
				{
					similarSearchType: '2',
					specCode: '00000004076',
					specCodeDisp: 'C3',
					specName: 'Side Hole Machining',
					specValue: 'a',
					specValueDisp: 'Not Provided',
				},
			],
		},
	},
};

export const PurchaseLinkUser: Story = {
	args: { isPurchaseLinkUser: true },
};

export const AbleToCheckout: Story = {
	args: { isPurchaseLinkUser: true, isAbleToCheckout: true },
};

export const CheckoutLoading: Story = {
	args: { isPurchaseLinkUser: true, isAbleToCheckout: true, loading: true },
};
