import { ComponentMeta, ComponentStory, Story } from '@storybook/react';
import React from 'react';
import { Props, Themes, Label } from './Label';
import { SaleLabel } from './SaleLabel';
import '@/i18n';

export default {
	component: Label,
	argTypes: {
		theme: {
			options: Themes,
			control: {
				type: `select`,
			},
		},
	},
	subcomponents: { SaleLabel },
} as ComponentMeta<typeof Label>;

export const _ThemeVariation: ComponentStory<typeof Label> = args => (
	<dl>
		<dt>Controllable</dt>
		<dd>
			<Label {...args}>controllable</Label>
		</dd>
		<dt>Theme</dt>
		<dd>
			{Themes.map((theme, index) => (
				<div key={index}>
					<Label theme={theme}>{theme}</Label>
				</div>
			))}
		</dd>
	</dl>
);

export const _Sale: Story<Props> = () => (
	<dl>
		<dt>Sale</dt>
		<dd>
			<SaleLabel />
		</dd>
	</dl>
);
