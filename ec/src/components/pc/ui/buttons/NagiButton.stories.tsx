import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import React from 'react';
import styles from './Button.stories.module.scss';
import { Size } from './ButtonBase';
import {
	NagiButton,
	ButtonProps,
	NagiLinkButton,
	LinkButtonProps,
	ColorTheme,
} from './NagiButton';

const ColorThemeList: ColorTheme[] = ['primary', 'secondary', 'tertiary'];
const SizeList: Size[] = ['s', 'm', 'max'];

export default {
	component: NagiButton,
	argTypes: {
		size: {
			options: SizeList,
			control: {
				type: `select`,
			},
		},
		theme: {
			options: ColorThemeList,
			control: {
				type: `select`,
			},
		},
		disabled: { control: { type: `boolean` } },
	},
	subcomponents: {
		NagiLinkButton,
	},
};

export const _Button: Story<ButtonProps> = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<NagiButton {...args} onClick={action('clicked')}>
					Control操作用
				</NagiButton>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Size</dt>
			<dd>
				{SizeList.map((size, index) => (
					<div className={styles.buttonBox} key={index}>
						<NagiButton onClick={action('clicked')} size={size}>
							{size}
						</NagiButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme (size: m)</dt>
			<dd>
				{ColorThemeList.map((theme, index) => (
					<div className={styles.buttonBox} key={index}>
						<NagiButton onClick={action('clicked')} theme={theme} size="m">
							{theme}
						</NagiButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Disabled (size: m)</dt>
			<dd>
				<NagiButton onClick={action('clicked')} disabled size="m">
					Disabled NagiButton
				</NagiButton>
			</dd>
		</dl>
	</>
);

export const _Link: Story<LinkButtonProps> = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<NagiLinkButton {...args} href="#">
					Control操作用
				</NagiLinkButton>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Size</dt>
			<dd>
				{SizeList.map((size, index) => (
					<div className={styles.buttonBox} key={index}>
						<NagiLinkButton href="#" size={size}>
							{size}
						</NagiLinkButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme (size: m)</dt>
			<dd>
				{ColorThemeList.map((theme, index) => (
					<div className={styles.buttonBox} key={index}>
						<NagiLinkButton href="#" theme={theme} size="m">
							{theme}
						</NagiLinkButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Disabled (size: m)</dt>
			<dd>
				<NagiLinkButton href="#" disabled size="m">
					Disabled NagiLinkButton
				</NagiLinkButton>
			</dd>
		</dl>
	</>
);
