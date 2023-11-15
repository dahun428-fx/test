import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import React from 'react';
import {
	Button as ButtonComponent,
	ButtonProps,
	LinkButton,
	LinkButtonProps,
	Themes,
	Icons,
} from './Button';
import styles from './Button.stories.module.scss';
import { Size } from './ButtonBase';

const sizeList: Size[] = ['xs', 's', 'm', 'l', 'xl', 'max'];

export default {
	component: ButtonComponent,
	argTypes: {
		size: {
			control: {
				type: `select`,
				labels: sizeList,
			},
		},
		theme: {
			control: {
				type: `select`,
				labels: Themes,
			},
		},
		disabled: { control: { type: `boolean` } },
	},
	subcomponents: {
		LinkButton,
	},
};

export const _Button: Story<ButtonProps> = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<ButtonComponent {...args} onClick={action('clicked')}>
					Control操作用
				</ButtonComponent>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Size</dt>
			<dd>
				{sizeList.map((size, index) => (
					<div className={styles.buttonBox} key={index}>
						<ButtonComponent onClick={action('clicked')} size={size}>
							{size}
						</ButtonComponent>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme (size: m)</dt>
			<dd>
				{Themes.map((theme, index) => (
					<div className={styles.buttonBox} key={index}>
						<ButtonComponent onClick={action('clicked')} theme={theme} size="m">
							{theme}
						</ButtonComponent>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Disabled (size: m)</dt>
			<dd>
				<ButtonComponent onClick={action('clicked')} disabled size="m">
					Disabled Button
				</ButtonComponent>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Icon (size: s)</dt>
			<dd>
				{Icons.map((icon, index) => (
					<div className={styles.buttonBox} key={index}>
						{Themes.map((theme, index) => (
							<ButtonComponent
								onClick={action('clicked')}
								icon={icon}
								theme={theme}
								key={index}
								size="s"
								className={styles.keepDistance}
							>
								{icon}
							</ButtonComponent>
						))}
						<ButtonComponent
							onClick={action('clicked')}
							icon={icon}
							disabled
							key={index}
							size="s"
							className={styles.keepDistance}
						>
							{icon}
						</ButtonComponent>
					</div>
				))}
			</dd>
		</dl>
	</>
);

export const _Link: Story<LinkButtonProps> = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<LinkButton {...args} href="#">
					Control操作用
				</LinkButton>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Size</dt>
			<dd>
				{sizeList.map((size, index) => (
					<div className={styles.buttonBox} key={index}>
						<LinkButton href="#" size={size}>
							{size}
						</LinkButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme (size: m)</dt>
			<dd>
				{Themes.map((theme, index) => (
					<div className={styles.buttonBox} key={index}>
						<LinkButton href="#" theme={theme} size="m">
							{theme}
						</LinkButton>
					</div>
				))}
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Disabled (size: m)</dt>
			<dd>
				<LinkButton href="#" disabled size="m">
					Disabled LinkButton
				</LinkButton>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Icon (size: s)</dt>
			<dd>
				{Icons.map((icon, index) => (
					<div className={styles.buttonBox} key={index}>
						{Themes.map((theme, index) => (
							<LinkButton
								icon={icon}
								theme={theme}
								key={index}
								href="#"
								size="s"
								className={styles.keepDistance}
							>
								{icon}
							</LinkButton>
						))}
						<LinkButton
							icon={icon}
							disabled
							key="disabled"
							target="_blank"
							href="#"
							size="s"
							className={styles.keepDistance}
						>
							{icon}
						</LinkButton>
						<LinkButton
							icon={icon}
							target="_blank"
							key="new-tab"
							href="#"
							size="s"
							className={styles.keepDistance}
						>
							{icon}
						</LinkButton>
					</div>
				))}
			</dd>
		</dl>
	</>
);
