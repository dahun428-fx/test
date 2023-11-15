import { Story } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import styles from './Drawer.stories.module.scss';
import { Button } from '@/components/mobile/ui/buttons';

export default {
	component: Drawer,
	argTypes: {
		slideFrom: 'left',
	},
};

export const _Drawer: Story = args => {
	const [showsDrawer, setShowsDrawer] = useState(false);

	const handleShowDrawer = () => {
		setShowsDrawer(!showsDrawer);
	};

	return (
		<div className={styles.container}>
			<div className={styles.buttonWrapper}>
				<Button onClick={handleShowDrawer} size="s">
					Show Drawer
				</Button>
			</div>
			<div className={styles.drawerWrapper}>
				<Drawer {...args} isOpen={showsDrawer}>
					<div className={styles.drawerBodyWrapper}>This is drawer</div>
				</Drawer>
			</div>
		</div>
	);
};
