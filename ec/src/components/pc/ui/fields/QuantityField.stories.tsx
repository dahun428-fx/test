import { Story } from '@storybook/react';
import { QuantityField } from './index';

export default {
	component: QuantityField,
	argTypes: {},
};

export const _QuantityField: Story = args => (
	<div>
		enabled
		<div>
			<QuantityField
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
			<QuantityField
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
