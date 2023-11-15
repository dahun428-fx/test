import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Price, Props } from './Price';
import { CurrencyProvider } from './context';

export default {
	component: Price,
	argTypes: {
		value: {
			type: 'number',
		},
	},
} as ComponentMeta<typeof Price>;

export const _Standard: ComponentStory<typeof Price> = args => {
	return render(Price, args);
};

export const _Accent: ComponentStory<typeof Price> = args => {
	return render(Price, { ...args, theme: 'accent' });
};

export const _Fallback: ComponentStory<typeof Price> = args => {
	return render(Price, { ...args, ccyCode: '' });
};

function render(
	Component: React.VFC<Props>,
	{ theme, ...props }: Partial<Props>
) {
	return (
		<dl>
			<dt>controlable</dt>
			<dd>
				<Component {...{ value: '123456', ccyCode: 'MYR', theme, ...props }} />
			</dd>
			<dt>symbol less</dt>
			<dd>
				<Component theme={theme} ccyCode="MYR" value={123456.789} symbolLess />
			</dd>
			<dt>with currency context provider</dt>
			<dd>
				<CurrencyProvider ccyCode={props.ccyCode ?? 'MYR'}>
					<p>
						<Component theme={theme} value={-200} />
					</p>
					<p>
						<Component theme={theme} value="350" />
					</p>
				</CurrencyProvider>
			</dd>
		</dl>
	);
}
