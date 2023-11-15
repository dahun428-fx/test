import { ComponentStoryObj, Meta } from '@storybook/react';
import { CategoryInfo, Props } from './CategoryInfo';
type Story = ComponentStoryObj<typeof CategoryInfo>;

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
		specSearchDispType: '1',
		templateTypeList: [],
		childCategoryList: [
			{
				categoryCode: 'M3301050100',
				categoryName: 'Pan Head Screws',
				departmentCode: 'mech',
				parentCategoryCodeList: ['mech_screw', 'M3301000000', 'M3301050000'],
				categoryImageUrl:
					'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050100.jpg',
				categoryDetail:
					'Small pan head screws<br />The head shape is like a pot turned upside down. <br />The corner of the head is rounded, and it is tightened with a Phillips screwdriver.',
				specSearchFlag: '1',
				specSearchDispType: '1',
				templateTypeList: [],
				childCategoryList: [],
				displayOrder: 2147483647,
				promptDeliveryFlag: '0',
			},
			{
				categoryCode: 'M3301050200',
				categoryName: 'Flat Head Machine Screws',
				departmentCode: 'mech',
				parentCategoryCodeList: ['mech_screw', 'M3301000000', 'M3301050000'],
				categoryImageUrl:
					'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050200.jpg',
				categoryDetail:
					'Small countersunk screws<br />The top of the head is flat and the bearing surface is conical. It has a shape like a plate. <br />The nominal length (L) represents the length (overall length) from the head. <br />Used when you do not want the head to protrude, or when you want to set it at the same or lower level as the part to be fastened. <br />It is necessary to process the parts according to the head shape (countersinking). <br />It is most notably used in door hinges.',
				specSearchFlag: '1',
				specSearchDispType: '1',
				templateTypeList: [],
				childCategoryList: [],
				displayOrder: 2147483647,
				promptDeliveryFlag: '0',
			},
			{
				categoryCode: 'M3301050400',
				categoryName: 'Small Truss Screws',
				departmentCode: 'mech',
				parentCategoryCodeList: ['mech_screw', 'M3301000000', 'M3301050000'],
				categoryImageUrl:
					'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050400.jpg',
				categoryDetail:
					'Small truss screws<br />Characterized by a round head and a larger head diameter and lower head height compared to the pan head screw. <br />Because the outer diameter of the head is large, the contact area with the part is large, which prevents loosening.',
				specSearchFlag: '1',
				specSearchDispType: '1',
				templateTypeList: [],
				childCategoryList: [],
				displayOrder: 2147483647,
				promptDeliveryFlag: '0',
			},
			{
				categoryCode: 'M3301050500',
				categoryName: 'Binding Head Screws',
				departmentCode: 'mech',
				parentCategoryCodeList: ['mech_screw', 'M3301000000', 'M3301050000'],
				categoryImageUrl:
					'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050500.jpg',
				categoryDetail:
					'Small bind screws<br />The head is trapezoidal and the top is rounded, and the head diameter is slightly larger compared to the small pan head screw. <br />Although the head diameter is larger than the pan head screw, it is smaller than the truss small screw, so its shape is in between the small pan head screw and small truss screw.',
				specSearchFlag: '1',
				specSearchDispType: '1',
				templateTypeList: [],
				childCategoryList: [],
				displayOrder: 2147483647,
				promptDeliveryFlag: '0',
			},
			{
				categoryCode: 'M3301050600',
				categoryName: 'Upset bolts',
				departmentCode: 'mech',
				parentCategoryCodeList: ['mech_screw', 'M3301000000', 'M3301050000'],
				categoryImageUrl:
					'//stg0-my.misumi-ec.com/linked/material/mech/category/M3301050600.jpg',
				categoryDetail:
					'Small upset screws<br />Features a hexagonal head with a dent and cross slot. <br />Various tools can be used for fastening. <br />The hexagon or cross slot on the head are used to tighten.',
				specSearchFlag: '1',
				specSearchDispType: '1',
				templateTypeList: [],
				childCategoryList: [],
				displayOrder: 2147483647,
				promptDeliveryFlag: '0',
			},
		],
		displayOrder: 2147483647,
		promptDeliveryFlag: '0',
	},
	categoryList: [],
	topCategoryCode: '',
};
export default {
	component: CategoryInfo,
	args,
} as Meta<typeof CategoryInfo>;

export const Default: Story = {};

export const ShortDescription: Story = {
	args: {
		category: {
			...args.category,
			categoryDetail:
				'We handle almost all types of screws that are on the market',
		},
	},
};
export const NoDescription: Story = {
	args: { category: { ...args.category, categoryDetail: undefined } },
};

export const NoCategoryListAndDescription: Story = {
	args: {
		category: {
			...args.category,
			childCategoryList: [],
			categoryDetail: undefined,
		},
	},
};
