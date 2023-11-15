import { ComponentStoryObj, Meta } from '@storybook/react';
import { ProductHtml } from './ProductHtml';
import { wysiwygTabIds } from '@/models/domain/series/tab';

type Story = ComponentStoryObj<typeof ProductHtml>;

function getColor(index: number) {
	return index % 3 === 0 ? '#fdd' : index % 3 === 1 ? '#dfd' : '#cdf';
}

const defaultWysiwygList = wysiwygTabIds.map((id, index) => ({
	id,
	html: `<div style="padding: 10px; text-align: center; background: ${getColor(
		index
	)};">${id}</div>`,
}));

export default {
	component: ProductHtml,
	args: {
		wysiwygList: defaultWysiwygList,
	},
} as Meta<typeof ProductHtml>;

export const Default: Story = {};

export const Keyboard: Story = {
	args: {
		wysiwygList: [
			{
				id: 'productSpecifications',
				html: '<h2>Specification Table</h2><div class="pad_b15"><table border="0" cellspacing="0"><tbody><tr><td align="center" class="headerCell" rowspan="2">Model</td><td align="center" class="headerCell" rowspan="2">Interface</td><td align="center" class="headerCell" rowspan="2">Main Body Color</td></tr><tr></tr><tr><td class="bodyCell"><font class="fontType">PCP-ACK-595US-PS2-R </font></td><td align="center" class="bodyCell" rowspan="2">PS/2</td><td align="center" class="bodyCell">White</td></tr><tr><td class="bodyCell"><font class="fontType">PCP-ACK-595BUS-PS2-R</font></td><td align="center" class="bodyCell">Black</td></tr><tr><td class="bodyCell"><font class="fontType">PCP-ACK-595US-USB-R</font></td><td align="center" class="bodyCell">USB</td><td align="center" class="bodyCell">White</td></tr></tbody></table></div><h2>Overview of Specifications</h2><div class="pad_b15"><img src="//stg0-my.misumi-ec.com/linked/item/10400109150/img/oth_01large.gif" alt="For PS/2: USB, English 88-Key Keyboard: related image" /><br /></div><div class="pad_b15">Specifications<br /><table border="0" cellspacing="0"><tbody><tr><td class="headerCell">Model</td><td class="bodyCell" align="center"><font class="fontType">PCP-ACK-595US-PS2-R</font></td><td class="bodyCell" align="center"><font class="fontType">PCP-ACK-595BUS-PS2-R</font></td><td class="bodyCell" align="center"><font class="fontType">PCP-ACK-595US-USB-R</font></td></tr><tr><td class="headerCell">Main Body Color</td><td class="bodyCell" align="center">White</td><td class="bodyCell" align="center">Black</td><td class="bodyCell" align="center">White</td></tr><tr><td class="headerCell">Keyboard</td><td class="bodyCell" colspan="3" align="center">English 88-Key Keyboard</td></tr><tr><td class="headerCell">Interface</td><td class="bodyCell" colspan="2" align="center">PS/2 (Mini DIN 6-Pin Male)</td><td class="bodyCell" align="center">USB (type A male)</td></tr><tr><td class="headerCell">Weight / External dimensions (mm)</td><td class="bodyCell" colspan="3" align="center">500 g, 289 (W) &times; 144 (D) &times; 29 (H)</td></tr><tr><td class="headerCell">Cable Length</td><td class="bodyCell" colspan="3" align="center">1.8m</td></tr><tr><td class="headerCell">Standard </td><td class="bodyCell" colspan="3" align="center">CE, UL, and FCC</td></tr></tbody></table></div>',
			},
		],
	},
};
