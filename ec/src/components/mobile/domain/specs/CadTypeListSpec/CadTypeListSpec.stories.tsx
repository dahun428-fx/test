import { Story } from '@storybook/react';
import { CadTypeListSpec, Props } from './CadTypeListSpec';

export default {
	component: CadTypeListSpec,
	args: {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onChange: () => {},
	},
};

export const _CadTypeListSpec: Story<Props> = args => (
	<CadTypeListSpec
		{...{
			...args,
			cadTypeList: [
				{
					cadType: '1',
					cadTypeDisp: '2D',
					hiddenFlag: '0',
					selectedFlag: '1',
				},
				{
					cadType: '2',
					cadTypeDisp: '3D',
					hiddenFlag: '0',
					selectedFlag: '0',
				},
			],
		}}
	/>
);
