import { ComponentStoryObj, Meta } from '@storybook/react';
import { CenterSpec } from './CenterSpec';
import { spec } from './CenterSpec.mocks';
import { Flag } from '@/models/api/Flag';

type Component = typeof CenterSpec;
type Story = ComponentStoryObj<Component>;

export default {
	component: CenterSpec,
	args: {
		checkedSpecValues: [],
		categorySpecQuery: '00000146753::a',
		hasCategorySpecParam: true,
		spec,
	},
} as Meta<Component>;

export const _CenterListSpec: Story = {
	args: {},
};

export const _CenterListSpecWithChecked: Story = {
	args: {
		checkedSpecValues: ['a', 'b'],
	},
};

export const _CenterListSpecWithLink: Story = {
	args: {
		hasCategorySpecParam: false,
	},
};

export const _CenterListSpecWithHidden: Story = {
	args: {
		spec: {
			...spec,
			specValueList: spec.specValueList.map((spec, index) => ({
				...spec,
				hiddenFlag: index % 2 === 0 ? Flag.TRUE : Flag.FALSE,
			})),
		},
	},
};
