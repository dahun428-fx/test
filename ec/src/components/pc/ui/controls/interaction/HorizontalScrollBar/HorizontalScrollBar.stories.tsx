import { Meta, Story } from '@storybook/react';
import { HorizontalScrollBar } from './HorizontalScrollBar';

export default {} as Meta;

export const _Base: Story = () => {
	return (
		<dl style={{ padding: '100px 200px' }}>
			<dt>Default</dt>
			<dd style={{ padding: '25px', maxWidth: '600px' }}>
				<div style={{ position: 'relative' }}>
					<HorizontalScrollBar
						percent={0.4}
						scrollBarWidth={0.5}
						onScroll={percent => percent}
					/>
				</div>
			</dd>

			<dt>Scrollbar 30% width</dt>
			<dd style={{ padding: '25px', maxWidth: '600px' }}>
				<div style={{ position: 'relative' }}>
					<HorizontalScrollBar
						percent={0.3}
						scrollBarWidth={0.3}
						onScroll={percent => percent}
					/>
				</div>
			</dd>
		</dl>
	);
};
