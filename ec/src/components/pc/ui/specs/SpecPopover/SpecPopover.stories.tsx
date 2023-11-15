import { ComponentStoryObj, Meta } from '@storybook/react';
import { PopoverTrigger } from './PopoverTrigger';
import {
	illustrationSpec,
	imageSpec,
	listSpec,
} from '@/components/pc/ui/specs/SpecPopover/SpecPopover.mocks';
import { Flag } from '@/models/api/Flag';
import { normalize } from '@/utils/domain/spec/normalize';

type Component = typeof PopoverTrigger;
type Story = ComponentStoryObj<Component>;

export default {
	component: PopoverTrigger,
	args: {
		children: (
			<div
				style={{
					width: '300px',
					height: '150px',
					backgroundColor: '#ddd',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '20px',
				}}
			>
				The inserted UI are displayed
			</div>
		),
	},
	decorators: [
		story => (
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<div style={{ display: 'inline-block', width: '260px' }}>{story()}</div>
			</div>
		),
	],
} as Meta<Component>;

const normalizedListSpec = normalize(listSpec);
const normalizedIllustrationSpec = normalize(illustrationSpec);
const normalizedImageSpec = normalize(imageSpec);

export const ShowMore: Story = {
	args: {
		spec: {
			...normalizedListSpec,
			supplementType: undefined,
			specImageUrl: undefined,
		},
	},
};

export const ShowMoreDetail: Story = { args: { spec: normalizedListSpec } };

export const ShowMoreIllustration: Story = {
	args: {
		spec: {
			...normalizedIllustrationSpec,
			specValueList: normalizedIllustrationSpec.specValueList.map(
				(value, index) => ({
					...value,
					selectedFlag: index % 2 === 0 ? Flag.TRUE : Flag.FALSE,
				})
			),
		},
	},
};

export const ShowMoreZoomImage: Story = {
	args: {
		spec: {
			...normalizedImageSpec,
			specValueList: normalizedImageSpec.specValueList.map((value, index) => ({
				...value,
				selectedFlag: index % 2 === 0 ? Flag.TRUE : Flag.FALSE,
			})),
		},
	},
};

export const Detail: Story = {
	args: {
		spec: {
			...normalizedListSpec,
			specValueList: normalizedListSpec.specValueList.slice(0, 1),
		},
	},
};

export const Illustration: Story = {
	args: { spec: normalizedIllustrationSpec },
};

export const ZoomImage: Story = { args: { spec: normalizedImageSpec } };
