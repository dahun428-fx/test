import { Story } from '@storybook/react';
import { TextField } from './TextField';

export default {
	component: TextField,
	argTypes: {},
};

export const _TextField: Story = args => (
	<div>
		enabled
		<div>
			<TextField
				{...{
					...args,
					value: null,
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		disabled
		<div>
			<TextField
				{...{
					...args,
					value: null,
					onChange: () => {
						// noop
					},
					disabled: true,
				}}
			/>
		</div>
	</div>
);
