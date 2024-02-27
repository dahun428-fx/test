import { ComponentStoryObj, Meta } from '@storybook/react';
import { PartNumberHeader as PartNumberHeaderComponent } from './PartNumberHeader';
import type { Props } from './PartNumberHeader';

const args: Props = {
	guideCount: 0,
	totalCount: 8150,
	completeFlag: '0',
	partNumber: 'A-PHAL3-[50-100/10]-P[1-2.99/0.01]',
	cad3DPreviewFlag: '0',
	brandCode: 'MSM1',
	seriesCode: '110302636410',
	cadId: '',
	cadDownloadButtonType: '1',
	moldExpressType: '',
	brandName: 'MSM1',
	seriesName: '',
};
type Story = ComponentStoryObj<typeof PartNumberHeaderComponent>;

const PartNumberHeader = ({ ...args }: Props) => {
	return <PartNumberHeaderComponent {...{ ...args }} />;
};

export default {
	component: PartNumberHeaderComponent,
	args,
} as Meta<typeof PartNumberHeader>;

export const Default: Story = {
	args: {},
};

export const TotalCountEqualZero: Story = {
	args: {
		totalCount: 0,
	},
};
export const TemplateSimple: Story = {
	args: {},
};

export const TemplateSimpleTotalCountEqualOne: Story = {
	args: { totalCount: 1, guideCount: 6 },
};
export const TemplateSimpleGuideCountEqualMaxGuideCount: Story = {
	args: {
		guideCount: 6,
	},
};
export const CompleteFlagNotComplete: Story = {
	args: {
		completeFlag: '0',
		totalCount: 1,
	},
};

export const CompleteFlag: Story = {
	args: {
		partNumber: 'A-PHAL3-50-P1',
		completeFlag: '1',
	},
};

export const CadPreview: Story = {
	args: {
		partNumber: 'A-PHAL3-50-P1',
		completeFlag: '1',
		cadId: 'D1',
		cad3DPreviewFlag: '1',
	},
};
