import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SeriesInfoText } from './SeriesInfoText';

export default {
	component: SeriesInfoText,
	args: {
		seriesInfoText: [
			'<b>seriesInfo Text1</b>',
			'<i>seriesInfo Text2</i>',
			'seriesInfo Text3 <a href="https://google.com">Link</a>',
		],
	},
} as ComponentMeta<typeof SeriesInfoText>;

export const Default: ComponentStory<typeof SeriesInfoText> = args => (
	<SeriesInfoText {...args} />
);
