import { Story } from '@storybook/react';
import React from 'react';
import { Collapsible } from './Collapsible';
import styles from './Collapsible.stories.module.scss';

export default {
	component: Collapsible,
	argTypes: {},
};

export const _Collapsed: Story = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<Collapsible title="Control" {...args}>
					<div>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						<br /> Nulla placeat incidunt repudiandae quibusdam iusto ea amet
						deserunt animi voluptatem,
						<br />
						tenetur, sint dolorum rem magni impedit possimus dignissimos sit,
						dolor qui?
					</div>
				</Collapsible>
			</dd>
		</dl>

		<dl className={styles.list}>
			<dt>Theme (default: primary)</dt>
			<dd>
				<Collapsible title="Primary">
					<div>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						<br /> Nulla placeat incidunt repudiandae quibusdam iusto ea amet
						deserunt animi voluptatem,
						<br />
						tenetur, sint dolorum rem magni impedit possimus dignissimos sit,
						dolor qui?
					</div>
				</Collapsible>
			</dd>
			<dd>
				<Collapsible title="Secondary" theme="secondary">
					<div>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						<br /> Nulla placeat incidunt repudiandae quibusdam iusto ea amet
						deserunt animi voluptatem,
						<br />
						tenetur, sint dolorum rem magni impedit possimus dignissimos sit,
						dolor qui?
					</div>
				</Collapsible>
			</dd>
		</dl>

		<dl className={styles.list}>
			<dt>Always expanded</dt>
			<dd>
				<Collapsible title="Always expanded" alwaysExpanded>
					<div>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						<br /> Nulla placeat incidunt repudiandae quibusdam iusto ea amet
						deserunt animi voluptatem,
						<br />
						tenetur, sint dolorum rem magni impedit possimus dignissimos sit,
						dolor qui?
					</div>
				</Collapsible>
			</dd>
		</dl>
	</>
);
