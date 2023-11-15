import { Story } from '@storybook/react';
import { Props, DisplayTypeSwitch, Option } from './DisplayTypeSwitch';

const options: Record<number, Option[]> = {
	3: ['dispList', 'dispPhoto', 'dispDetail'],
	2: ['dispList', 'dispPhoto'],
};

export default {
	component: DisplayTypeSwitch,
	args: {
		current: 'dispList',
		options: options[3],
	},
	argTypes: {
		current: {
			control: {
				type: 'radio',
			},
		},
		options: {
			options: Object.keys(options),
			mapping: options,
			control: {
				type: 'radio',
				labels: { 3: 'list, photo, or detail', 2: 'list or photo' },
			},
		},
		onChange: { action: 'clicked' },
	},
};

/**
 * ビュー切り替え
 */
export const _DisplayTypeSwitch: Story<Props> = args => (
	<>
		<dl>
			<dt>Control 操作用</dt>
			<dd>
				<DisplayTypeSwitch {...args} />
			</dd>
		</dl>
	</>
);
