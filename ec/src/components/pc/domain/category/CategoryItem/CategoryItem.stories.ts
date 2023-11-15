import { ComponentStoryObj, Meta } from '@storybook/react';
import { CategoryItem, Props } from './CategoryItem';
type Story = ComponentStoryObj<typeof CategoryItem>;

const args: Props = {
	category: {
		categoryCode: 'M3301050000',
		categoryName: 'Cross Recessed Bolts',
		departmentCode: 'mech',
		parentCategoryCodeList: ['mech_screw', 'M3301000000'],
		categoryImageUrl:
			'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050000.jpg',
		categoryDetail:
			'We handle almost all types of screws that are on the market, including small pan head screws, small countersunk screws, low head screws and tamper-proof screws. <br />They are mainly available in small boxes and packs, but we sell many items individually. For customers who are price sensitive, purchasing in small boxes is recommended. <br />Contact us if you cannot find the desired size. <br />[Materials]<br /> Iron (steel), stainless steel (SUS304 SUS410 SUS316L), titanium, brass, aluminum, special materials, etc.<br />[Surface Processing]<br /> None, ferrosoferric oxide coating, chromate, unichrome, plating, nickel, chrome, coating, color, coating, polishing, special, etc.<br />[Nominal]<br /> Metric screw (coarse, fine, left-hand thread) M1.7 to M20, tapping screw, etc.<br />[Length] 2 to 500 mm',
		specSearchFlag: '1',
		childCategoryList: [],
		specSearchDispType: '1',
		templateTypeList: [],
		displayOrder: 2147483647,
		promptDeliveryFlag: '0',
	},
};
export default {
	component: CategoryItem,
	args,
} as Meta<typeof CategoryItem>;

export const Default: Story = {};
