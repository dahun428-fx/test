import { addDecorator, Meta, Story } from '@storybook/react';
import { Fragment } from 'react';
import { Themes, TooltipProps } from './Tooltip';
import { Button } from '@/components/pc/ui/buttons';
import {
	useTooltip,
	TooltipProvider,
	TooltipController,
} from '@/components/pc/ui/tooltips';

addDecorator(Story => (
	<TooltipProvider>
		<Story />
		<TooltipController />
	</TooltipProvider>
));

const content =
	'The button to order the target product now. Go to the order confirmation page.';

export const _Example: Story<TooltipProps> = args => {
	const top = useTooltip<HTMLDivElement>({
		...args,
		content,
		direction: 'top',
	});
	const right = useTooltip<HTMLDivElement>({
		...args,
		content,
		direction: 'right',
	});
	const bottom = useTooltip<HTMLDivElement>({
		...args,
		content,
		direction: 'bottom',
	});
	const left = useTooltip<HTMLDivElement>({
		...args,
		content,
		direction: 'left',
	});

	const tooltipMap = { top, right, bottom, left };

	return (
		<dl style={{ padding: '100px 200px' }}>
			{Object.entries(tooltipMap).map(([key, { bind }]) => (
				<Fragment key={key}>
					<dt>direction {key}</dt>
					<dd style={{ padding: '25px' }}>
						<div style={{ display: 'inline-block' }} {...bind}>
							<Button theme="conversion" icon="order-now" size="s">
								Order Now
							</Button>
						</div>
					</dd>
				</Fragment>
			))}
		</dl>
	);
};

export default {
	component: _Example,
	argTypes: {
		theme: {
			options: Themes,
			control: {
				type: `select`,
			},
		},
	},
} as Meta;
