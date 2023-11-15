import { Story } from '@storybook/react';
import { Option, Props, Select } from './Select';

const groupOrder: string[] = ['2D', '3D', 'Other'];

const items: Option[] = [
	{
		label: 'DWF',
		group: '2D',
		value: 'DWF',
	},
	{
		label: 'DWG',
		group: '2D',
		value: 'DWG',
	},
	{
		label: 'DXF',
		group: '2D',
		value: 'DXF',
	},
	{
		label: 'Autodesk Inventor®',
		group: '3D',
		value: 'Autodesk Inventor®',
	},
	{
		label: 'Catia®',
		group: '3D',
		value: 'Catia®',
	},
	{
		label: 'IGES',
		group: '3D',
		value: 'IGES',
	},
	{
		label: 'NX®',
		group: '3D',
		value: 'NX®',
	},
	{
		label: 'Parasolid',
		group: '3D',
		value: 'Parasolid',
	},
	{
		label: 'SAT V7',
		group: '3D',
		value: 'SAT-700',
	},
	{
		label: 'Solid Edge®',
		group: '3D',
		value: 'Solid Edge®',
	},
	{
		label: 'SolidWorks®',
		group: '3D',
		value: 'SolidWorks®',
	},
	{
		label: 'STEP',
		group: '3D',
		value: 'STEP',
	},
	{
		label: 'Creo Elements/Direct Modeling >=17.0',
		group: '3D',
		value: 'm3d_sd_creo17',
	},
	{
		label: 'Creo Parametric',
		group: '3D',
		value: 'Creo Parametric',
	},
	{
		label: 'Other',
		value: 'others',
		group: 'Other',
	},
];

export default {
	component: Select,
	argTypes: {},
};

export const _Select: Story<Props> = args => (
	<div>
		default
		<div>
			<Select
				{...{
					...args,
					groupOrder,
					items,
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		Disabled
		<div>
			<Select
				{...{
					...args,
					groupOrder,
					items,
					disabled: true,
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		Has value
		<div>
			<Select
				groupOrder={groupOrder}
				items={items}
				value={items[3]?.value}
				onChange={() => {
					// noop
				}}
			/>
		</div>
		Not group
		<div>
			<Select
				{...{
					...args,
					items,
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
		min Size
		<div>
			<Select
				{...{
					...args,
					items: [
						{
							label: '30 items',
							value: '30 items',
						},
						{
							label: '45 items',
							value: '45 items',
						},
						{
							label: '60 items',
							value: '60 items',
						},
					],
					size: 'min',
					onChange: () => {
						// noop
					},
				}}
			/>
		</div>
	</div>
);
