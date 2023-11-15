import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Price, Props } from './Price';
import styles from './Price.stories.module.scss';
import { CurrencyProvider } from './context';

export default {
	component: Price,
	args: {
		theme: 'standard',
		ccyCode: 'MYR',
		symbolLess: false,
		value: '385.88',
	},
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

export const _MediumAccent: ComponentStory<typeof Price> = args => {
	return render(Price, { ...args, theme: 'medium-accent' });
};

export const _LargeAccent: ComponentStory<typeof Price> = args => {
	return render(Price, { ...args, theme: 'large-accent' });
};

export const _Fallback: ComponentStory<typeof Price> = args => {
	return render(Price, { ...args, ccyCode: '' });
};

function render(Component: React.VFC<Props>, { theme, ...props }: Props) {
	return (
		<>
			<dl className={styles.item}>
				<dt>Controlable</dt>
				<dd>
					<Component theme={theme} ccyCode="MYR" {...props} />
				</dd>
			</dl>
			<dl className={styles.item}>
				<dt>Symbol less</dt>
				<dd>
					<Component
						theme={theme}
						ccyCode={props.ccyCode ?? 'MYR'}
						value={123456.789}
						symbolLess
					/>
				</dd>
			</dl>
			<dl className={styles.item}>
				<dt>With currency context provider</dt>
				<dd>
					<CurrencyProvider ccyCode={props.ccyCode ?? 'MYR'}>
						<p>
							<Component theme={theme} value={200.6} />
						</p>
					</CurrencyProvider>
				</dd>
			</dl>
			<dl className={styles.item}>
				<dt>Price is red</dt>
				<dd>
					<Component
						theme={theme}
						value={5000}
						ccyCode={props.ccyCode ?? 'MYR'}
						isRed
					/>
				</dd>
			</dl>
		</>
	);
}
