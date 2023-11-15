import { ComponentStoryObj, Meta } from '@storybook/react';
import { CategoryNavigation } from './CategoryNavigation';
import { CategoryNavigationProvider } from './context';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { assertNotNull } from '@/utils/assertions';

type Story = ComponentStoryObj<typeof CategoryNavigation>;

const mockData: Pick<
	Category,
	'departmentCode' | 'specSearchFlag' | 'promptDeliveryFlag'
> = {
	departmentCode: 'mech',
	specSearchFlag: '0',
	promptDeliveryFlag: '0',
};

const rootCategory: Category = {
	categoryCode: 'mech',
	categoryName: 'Mech',
	parentCategoryCodeList: [],
	...mockData,
	childCategoryList: [
		{
			categoryCode: 'mech1',
			categoryName: 'Mech 1',
			parentCategoryCodeList: ['mech'],
			...mockData,
			childCategoryList: [
				{
					categoryCode: 'mech11',
					categoryName: 'Mech 1-1',
					parentCategoryCodeList: ['mech', 'mech1'],
					...mockData,
					childCategoryList: [],
				},
				{
					categoryCode: 'mech12',
					categoryName: 'Mech 1-2',
					parentCategoryCodeList: ['mech', 'mech1'],
					...mockData,
					childCategoryList: [
						{
							categoryCode: 'mech121',
							categoryName: 'Mech 1-2-1',
							parentCategoryCodeList: ['mech', 'mech1', 'mech12'],
							...mockData,
							childCategoryList: [],
						},
					],
				},
			],
		},
		{
			categoryCode: 'mech2',
			categoryName: 'Mech 2',
			parentCategoryCodeList: ['mech'],
			...mockData,
			childCategoryList: [],
		},
		{
			categoryCode: 'mech3',
			categoryName: 'Mech 3',
			parentCategoryCodeList: ['mech'],
			...mockData,
			childCategoryList: [],
		},
	],
};

export default {
	component: CategoryNavigation,
	args: { categories: [] },
	decorators: [
		story => (
			<CategoryNavigationProvider>
				<div style={{ width: 320 }}>{story()}</div>
			</CategoryNavigationProvider>
		),
	],
} as Meta<typeof CategoryNavigation>;

export const TopCategoryWithPopOver: Story = {
	args: {
		categories: [rootCategory],
	},
};

assertNotNull(rootCategory.childCategoryList[0]);
assertNotNull(rootCategory.childCategoryList[0].childCategoryList[0]);

export const ChildCategory: Story = {
	args: {
		categories: [
			rootCategory,
			rootCategory.childCategoryList[0],
			rootCategory.childCategoryList[0].childCategoryList[0],
		],
	},
};

export const ChildCategoryWithChildren: Story = {
	args: {
		categories: [rootCategory, rootCategory.childCategoryList[0]],
	},
};
