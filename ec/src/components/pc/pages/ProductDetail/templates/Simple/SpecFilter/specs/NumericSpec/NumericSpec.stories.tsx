import { Meta, Story } from '@storybook/react';
import { NumericSpec } from './NumericSpec';
import styles from './NumericSpec.stories.module.scss';
import {
	MessageModalController,
	MessageModalProvider,
} from '@/components/pc/ui/modals/MessageModal';
import { Flag } from '@/models/api/Flag';
import { SpecViewType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

export default {
	component: NumericSpec,
	argTypes: {},
	decorators: [
		Story => (
			<MessageModalProvider>
				<Story />
				<MessageModalController />
			</MessageModalProvider>
		),
	],
} as Meta<typeof NumericSpec>;

export const _NumericSpec: Story = args => (
	<div>
		normal
		<div className={styles.container}>
			<NumericSpec
				{...{
					...args,
					spec: {
						specCode: '00000004019',
						specName: 'Length L',
						specUnit: 'mm',
						openCloseType: '3',
						specViewType: SpecViewType.NUMERIC,
						specValueList: [],
						numericSpec: {
							specValueRangeList: [
								{
									minValue: 10,
									maxValue: 200,
									stepValue: 0.1,
								},
								{
									minValue: 1000,
									maxValue: 1500,
									stepValue: 1,
								},
							],
							hiddenFlag: Flag.FALSE,
						},
					},
					/* eslint-disable @typescript-eslint/no-empty-function */
					onChange: () => {},
					onSelectHiddenSpec: () => {},
					sendLog: () => {},
					/* eslint-enable */
				}}
			/>
		</div>
	</div>
);
