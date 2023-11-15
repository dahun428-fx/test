import { Meta, Story } from '@storybook/react';
import { NumericSpecField } from './NumericSpecField';
import styles from './NumericSpecField.stories.module.scss';
import {
	MessageModalController,
	MessageModalProvider,
} from '@/components/pc/ui/modals/MessageModal';
import { Flag } from '@/models/api/Flag';

export default {
	component: NumericSpecField,
	decorators: [
		Story => (
			<MessageModalProvider>
				<Story />
				<MessageModalController />
			</MessageModalProvider>
		),
	],
} as Meta<typeof NumericSpecField>;

export const _NumericSpecField: Story = args => (
	<div>
		normal
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		HTML spec unit
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm<sup style="color:red">example</sup>',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		no spec unit
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						numericSpec: {
							hiddenFlag: Flag.FALSE,
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		value is set
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
							specValue: '20',
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		invalid value (NotNumericalString)
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
							specValue: 'xxx',
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		invalid value (TooManyDecimalPlaces)
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
							specValue: '11.11111',
							specValueRangeList: [
								{
									minValue: 10,
									maxValue: 200,
									stepValue: 0.0001,
								},
								{
									minValue: 1000,
									maxValue: 1500,
									stepValue: 1,
								},
							],
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		invalid value (OutOfRange)
		<div className={styles.container}>
			<NumericSpecField
				{...{
					...args,
					spec: {
						specUnit: 'mm',
						numericSpec: {
							hiddenFlag: Flag.FALSE,
							specValue: '300',
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
						},
					},
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
	</div>
);
