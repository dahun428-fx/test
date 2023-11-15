import { Story } from '@storybook/react';
import { AttentionMessageGroup } from './AttentionMessageGroup';
import styles from './AttentionMessageGroup.stories.module.scss';

export default {
	component: AttentionMessageGroup,
	argTypes: {},
};

export const _AttentionMessageGroup: Story = () => (
	<div className={styles.container}>
		<dl>
			<dt>Warning message</dt>
			<dd>
				<AttentionMessageGroup
					messageType="1"
					messageList={[
						{
							messageType: '1',
							messageLevel: '1',
							message: 'Lorem ipsum dolor ',
						},
					]}
				/>
			</dd>
			<dd>
				<AttentionMessageGroup
					messageType="1"
					messageList={[
						{
							messageType: '1',
							messageLevel: '2',
							message: 'Lorem ipsum dolor ',
						},
					]}
				/>
			</dd>
		</dl>
		<dl>
			<dt>Caution message</dt>
			<dd>
				<AttentionMessageGroup
					messageType="2"
					messageList={[
						{
							messageType: '2',
							messageLevel: '1',
							message:
								'Maxime voluptate aut eveniet dicta culpa illo quo hic dolores asperiores iste, exercitationem ratione magnam voluptatibus.',
						},
					]}
				/>
			</dd>
		</dl>
		<dl>
			<dt>Notice message</dt>
			<dd>
				<AttentionMessageGroup
					messageType="3"
					messageList={[
						{
							messageType: '3',
							messageLevel: '1',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
					]}
				/>
				<AttentionMessageGroup
					messageType="3"
					messageList={[
						{
							messageType: '3',
							messageLevel: '2',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
					]}
				/>
				<AttentionMessageGroup
					messageType="3"
					messageList={[
						{
							messageType: '3',
							messageLevel: '1',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
						{
							messageType: '3',
							messageLevel: '3',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
					]}
				/>
				<AttentionMessageGroup
					messageType="3"
					messageList={[
						{
							messageType: '3',
							messageLevel: '2',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
						{
							messageType: '3',
							messageLevel: '4',
							message: 'Corporis laborum praesentium molestias non dolore.',
						},
					]}
				/>
			</dd>
		</dl>
		<dl>
			<dt>Info message</dt>
			<dd>
				<AttentionMessageGroup
					messageType="4"
					messageList={[
						{
							messageType: '4',
							messageLevel: '1',
							message:
								'Maxime voluptate aut eveniet dicta culpa illo quo hic dolores asperiores iste, exercitationem ratione magnam voluptatibus.',
						},
						{
							messageType: '4',
							messageLevel: '2',
							message:
								'Maxime voluptate aut eveniet dicta culpa illo quo hic dolores asperiores iste, exercitationem ratione magnam voluptatibus.',
						},
					]}
				/>
			</dd>
		</dl>
	</div>
);
