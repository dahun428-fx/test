import { Story } from '@storybook/react';
import { ComboList } from './ComboList';

export default {
	component: ComboList,
};

/**
 * COMBO list
 */
export const _ComboList: Story = () => (
	<>
		<dl>
			<dt style={{ marginTop: '50px' }}>1item | ComboList</dt>
			<dd>
				<ComboList
					keyword="ajgsga"
					{...{
						comboResponse: {
							seriesList: [
								{
									brandCode: 'TRC1',
									brandName: 'トラスコ中山',
									partNumberList: [
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-S',
										},
									],
									productImageList: [
										{
											comment: 'エアージェット用サイレンサー',
											type: '1',
											url: '//stg1-jp.misumi-ec.com/linked/material/fs/TRC1/PHOTO/t010002765268.jpg',
										},
									],
									seriesCode: '223005175690',
									seriesName: 'エアージェット用サイレンサー',
								},
							],
							totalCount: 1,
						},
					}}
				/>
			</dd>
		</dl>
		<dl>
			<dt style={{ marginTop: '50px' }}>4item | ComboList</dt>
			<dd>
				<ComboList
					keyword="ajgsga"
					{...{
						comboResponse: {
							seriesList: [
								{
									brandCode: 'TRC1',
									brandName: 'トラスコ中山',
									partNumberList: [
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-SA',
										},
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-SB',
										},
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-SC',
										},
									],
									productImageList: [
										{
											comment: 'エアージェット用サイレンサー',
											type: '1',
											url: '//stg1-jp.misumi-ec.com/linked/material/fs/TRC1/PHOTO/t010002765268.jpg',
										},
									],
									seriesCode: '223005175690',
									seriesName: 'エアージェット用サイレンサー',
								},
								{
									brandCode: 'TRC1',
									brandName: 'トラスコ中山',
									partNumberList: [
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-CS',
										},
									],
									productImageList: [
										{
											comment: 'AJ-CS',
											type: '2',
											url: '//content.misumi-ec.com/image/upload/v1/p/jp/product/series/223005175634/223005175634_20220113191831.jpg',
										},
									],
									seriesCode: '223005175634',
									seriesName: 'エアージェット 1本ノズルセット',
								},
								{
									brandCode: 'TRC1',
									brandName: 'トラスコ中山',
									partNumberList: [
										{
											completeType: '4',
											matchRate: 47.7656,
											partNumber: 'AJ-MG',
										},
									],
									productImageList: [
										{
											comment: 'エアージェット用マグネット台（吸着力320N）',
											type: '1',
											url: '//stg1-jp.misumi-ec.com/linked/material/fs/TRC1/PHOTO/t010004563470.jpg',
										},
									],
									seriesCode: '223005175678',
									seriesName: 'エアージェット用マグネット台（吸着力320N）',
								},
								{
									brandCode: 'OMR1',
									brandName: 'オムロン',
									partNumberList: [
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGA',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGB',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGC',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGD',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGE',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGF',
										},
										{
											completeType: '4',
											matchRate: 46.0181,
											partNumber: 'A16-JGG',
										},
									],
									productImageList: [
										{
											comment: '押ボタンスイッチ 16Φ オプション品',
											type: '1',
											url: '//stg1-jp.misumi-ec.com/linked/material/el/OMR1/PHOTO/222004915072_001.jpg',
										},
									],
									seriesCode: '222004915072',
									seriesName: '押ボタンスイッチ 16Φ オプション品',
								},
							],
							totalCount: 4,
						},
					}}
				/>
			</dd>
		</dl>
	</>
);
