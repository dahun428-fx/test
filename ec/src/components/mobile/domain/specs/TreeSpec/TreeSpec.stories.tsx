import { Story } from '@storybook/react';
import { TreeSpec, Props } from './TreeSpec';

export default {
	component: TreeSpec,
	args: {
		spec: {
			specCode: '00000230940',
			specName: 'Material',
			specViewType: '10',
			openCloseType: '3',
			supplementType: '1',
			specValueList: [
				{
					specValue: 'a',
					specValueDisp: 'Steel',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [
						{
							specValue: '00000230940.a!00313',
							specValueDisp: 'SNB',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.a!00312',
							specValueDisp: 'SWCH Equivalent',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.a!00314',
							specValueDisp: 'Steel',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
					],
					specValueAttributeList: [],
				},
				{
					specValue: 'b',
					specValueDisp: 'Stainless Steel',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [
						{
							specValue: '00000230940.b!00334',
							specValueDisp: 'Equivalent to SUS304',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.b!00338',
							specValueDisp: 'SUS310S',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.b!00333',
							specValueDisp: 'SUS316',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.b!00335',
							specValueDisp: 'SUS316L',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
						{
							specValue: '00000230940.b!00336',
							specValueDisp: 'Stainless Steel',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
					],
					specValueAttributeList: [],
				},
				{
					specValue: 'c',
					specValueDisp: 'Aluminum',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [
						{
							specValue: '00000230940.c!00346',
							specValueDisp: 'Aluminum',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
					],
					specValueAttributeList: [],
				},
				{
					specValue: 'd',
					specValueDisp: 'Titanium',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [
						{
							specValue: '00000230940.d!00348',
							specValueDisp: 'Titanium',
							hiddenFlag: '0',
							selectedFlag: '0',
						},
					],
					specValueAttributeList: [],
				},
				{
					specValue: 'g',
					specValueDisp: 'Brass',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [],
					specValueAttributeList: [],
				},
			],
		},
		/* eslint-disable @typescript-eslint/no-empty-function */
		onChange: () => {},
		onSelectHiddenSpec: () => {},
		sendLog: () => {},
		/* eslint-enable */
	},
};

export const _TreeSpec: Story<Props> = args => (
	<>
		<dl>
			<dt>Tree Spec List</dt>
			<dd>
				<TreeSpec {...args} />
			</dd>
		</dl>
		<dl>
			<dt>Tree Spec List with one select items</dt>
			<dd>
				<TreeSpec
					{...{
						...args,
						partNumberSpec: {
							...args.spec,
							specValueList: [
								{
									specValue: 'a',
									specValueDisp: 'Steel',
									hiddenFlag: '0',
									selectedFlag: '1',
									childSpecValueList: [
										{
											specValue: '00000230940.a!00313',
											specValueDisp: 'SNB',
											hiddenFlag: '0',
											selectedFlag: '1',
										},
									],
								},
								...args.spec.specValueList.slice(1),
							],
						},
					}}
				/>
			</dd>
		</dl>
	</>
);
