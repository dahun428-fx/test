import { Story } from '@storybook/react';
import { NumericField } from './NumericField';

export default {
	component: NumericField,
	argTypes: {},
};

export const _NumericField: Story = args => (
	<div>
		enabled
		<div>
			<NumericField
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
			<NumericField
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
