import { Story } from '@storybook/react';
import { TextListSpec, Props } from './TextListSpec';

export default {
	component: TextListSpec,
	args: {
		spec: {
			specCode: '00000004019',
			specName: 'Length L',
			specValueList: [
				{ specValue: '1', specValueDisp: '100', selectedFlag: '0' },
				{ specValue: '2', specValueDisp: '200', selectedFlag: '0' },
				{ specValue: '3', specValueDisp: '300', selectedFlag: '0' },
				{ specValue: '4', specValueDisp: '400', selectedFlag: '0' },
				{ specValue: '5', specValueDisp: '500', selectedFlag: '0' },
				{ specValue: '6', specValueDisp: '600', selectedFlag: '0' },
				{ specValue: '7', specValueDisp: '700', selectedFlag: '0' },
				{ specValue: '8', specValueDisp: '800', selectedFlag: '0' },
				{ specValue: '9', specValueDisp: '900', selectedFlag: '0' },
				{
					specValue: '10',
					specValueDisp: '1000',
					selectedFlag: '0',
					hiddenFlag: '1',
				},
			],
			openCloseType: `1`,
		},
	},
};

export const _TextListSpec: Story<Props> = args => <TextListSpec {...args} />;
