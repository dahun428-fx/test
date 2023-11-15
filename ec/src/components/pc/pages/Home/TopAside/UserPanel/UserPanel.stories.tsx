import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { UserPanel } from './UserPanel';
import { Flag } from '@/models/api/Flag';
import { SettlementType } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';

type ComponentType = typeof UserPanel;
type Story = ComponentStoryObj<ComponentType>;

export default {
	component: UserPanel,
	args: {
		unfitCount: { quote: 0, order: 0 },
		informationMessageFlag: Flag.FALSE,
		couponMessageFlag: Flag.TRUE,
		unconfirmedCouponCount: 0,
		isPurchaseLinkUser: false,
		isEcUser: false,
		isProxyLogin: false,
		settlementType: SettlementType.ADVANCE,
		hasOrderPermission: true,
		hasShipToManagementPermission: true,
		hasUserManagementPermission: true,
		hasCadDownloadPermission: true,
		hasMyComponentsPermission: true,
		hasInvoiceReferencePermission: true,
		hasTransactionDetailReferencePermission: true,
	},
	decorators: [story => <div style={{ width: 465 }}>{story()}</div>],
} as ComponentMeta<ComponentType>;

export const _WosUser: Story = {
	args: {
		unfitCount: { quote: 2, order: 3 },
		unconfirmedCouponCount: 10,
		informationMessageFlag: Flag.TRUE,
	},
};

export const _PurchaseLink: Story = {
	args: { isPurchaseLinkUser: true },
};

export const _EC: Story = {
	args: {
		isEcUser: true,
		couponMessageFlag: Flag.FALSE,
		informationMessageFlag: Flag.FALSE,
		hasOrderPermission: false,
		hasShipToManagementPermission: false,
		hasUserManagementPermission: false,
		hasInvoiceReferencePermission: false,
		hasTransactionDetailReferencePermission: false,
	},
};

export const _ProxyLogin: Story = {
	args: {
		unfitCount: { quote: 2, order: 3 },
		unconfirmedCouponCount: 10,
		informationMessageFlag: Flag.TRUE,
		isProxyLogin: true,
	},
};
