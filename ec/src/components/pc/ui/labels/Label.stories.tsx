import { ComponentMeta, ComponentStory, Story } from '@storybook/react';
import React from 'react';
import { Props, Themes, Label } from './Label';
import { SaleLabel } from './SaleLabel';
import { Pict } from '@/components/pc/ui/labels/Pict';
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
			<SaleLabel saleEndDate="2022/02/10" />
		</dd>
	</dl>
);

export const _Pict: ComponentStory<typeof Pict> = () => {
	return (
		<dl style={{ padding: '10px' }}>
			<dt>single line</dt>
			<dl style={{ padding: '50px 200px' }}>
				<Pict pict="FL100" comment="Free length is available up to 100" />
			</dl>
			<dt>multi line</dt>
			<dl style={{ padding: '50px 200px' }}>
				<Pict pict="OD100" comment="Outer diameter (for mounting) is apx 100" />
			</dl>
		</dl>
	);
};
