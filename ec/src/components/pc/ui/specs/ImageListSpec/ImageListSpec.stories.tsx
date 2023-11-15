import { Story } from '@storybook/react';
import { ImageListSpec, Props } from './ImageListSpec';
import styles from './ImageListSpec.stories.module.scss';

export default {
	component: ImageListSpec,
	args: {
		spec: {
			openCloseType: '3',
			specCode: '00000144105',
			specName: 'Mounting Method',
			specValueList: [
				{
					specValue: 'b',
					specValueDisp: 'Retaining Ring',
					specValueImageUrl:
						'//stg0-my.misumi-ec.com/linked/illustration/mech/M2202_C2_S_b.png',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [],
					specValueAttributeList: [],
				},
				{
					specValue: 'd',
					specValueDisp: 'Lock Nut (Threaded)',
					specValueImageUrl:
						'//stg0-my.misumi-ec.com/linked/illustration/mech/M2202_C2_S_d.png',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [],
					specValueAttributeList: [],
				},
				{
					specValue: 'e',
					specValueDisp: 'Tapped',
					specValueImageUrl:
						'//stg0-my.misumi-ec.com/linked/illustration/mech/M2202_C2_S_e.png',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [],
					specValueAttributeList: [],
				},
				{
					specValue: 'f',
					specValueDisp: 'Set Screw (Set Screw Flat, D-Cut)',
					specValueImageUrl:
						'//stg0-my.misumi-ec.com/linked/illustration/mech/M2202_C2_S_f.png',
					hiddenFlag: '0',
					selectedFlag: '0',
					childSpecValueList: [],
					specValueAttributeList: [],
				},
			],
			specViewType: '7',
			supplementType: '1',
		},
		maxHeight: false,
	},
};

export const _ImageListSpec: Story<Props> = args => (
	<>
		<dl className={styles.list}>
			<dt>Theme for image 1 column</dt>
			<dd className={styles.description}>
				<ImageListSpec
					{...{
						...args,
						spec: {
							specCode: '00000196582',
							specName: 'Raceway Ring Shape',
							specViewType: '5',
							openCloseType: '3',
							supplementType: '1',
							specValueList: [
								{
									specValue: 'a',
									specValueDisp: 'Ball',
									specValueImageUrl:
										'//stg0-my.misumi-ec.com/linked/illustration/mech/M080201_C3_S_a.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
									specValueAttributeList: [],
								},
								{
									specValue: 'l',
									specValueDisp: 'Thrust Ball',
									specValueImageUrl:
										'//stg0-my.misumi-ec.com/linked/illustration/mech/M080201_C3_S_l.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
									specValueAttributeList: [],
								},
							],
						},
						onChange: () => {
							// noop
						},
					}}
				/>
			</dd>
			<dt>Theme for image 1 column (rectangle photos)</dt>
			<dd className={styles.description}>
				<ImageListSpec
					{...{
						...args,
						spec: {
							specCode: '00000196582',
							specName: 'Raceway Ring Shape',
							specViewType: '5',
							openCloseType: '3',
							supplementType: '1',
							specValueList: [
								{
									specValue: 'b',
									specValueDisp: 'Retaining Ring',
									specValueImageUrl:
										'//stg0-jp.misumi-ec.com/linked/illustration/mech/M330105_C1_S_a.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
								},
								{
									specValue: 'd',
									specValueDisp: 'Lock Nut',
									specValueImageUrl:
										'//stg0-jp.misumi-ec.com/linked/illustration/mech/M330105_C1_S_b.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
								},
							],
						},
						onChange: () => {
							// noop
						},
					}}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme for image 2 column</dt>
			<dd className={styles.description}>
				<ImageListSpec {...args} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Theme for image 2 column (rectangle photos)</dt>
			<dd className={styles.description}>
				<ImageListSpec
					{...{
						...args,
						spec: {
							...args.spec,
							specValueList: [
								{
									specValue: 'b',
									specValueDisp: 'Retaining Ring',
									specValueImageUrl:
										'//stg0-jp.misumi-ec.com/linked/illustration/mech/M330105_C1_S_a.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
								},
								{
									specValue: 'd',
									specValueDisp: 'Lock Nut',
									specValueImageUrl:
										'//stg0-jp.misumi-ec.com/linked/illustration/mech/M330105_C1_S_b.png',
									hiddenFlag: '0',
									selectedFlag: '0',
									childSpecValueList: [],
								},
							],
						},
					}}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>Zoom image by popover</dt>
			<dd className={styles.description}>
				<ImageListSpec
					{...{
						...args,
						spec: { ...args.spec, supplementType: '4' },
					}}
				/>
			</dd>
		</dl>
	</>
);
