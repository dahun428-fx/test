import { PartNumberSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse';
import { AlterationSpec } from '@/models/api/msm/ect/partNumber//SearchPartNumberResponse$search';

export type SpecCode = string;
export type SpecValues = string | string[] | number | undefined;

type ValueOf<T> = T[keyof T];

export const PUSpecViewType = {
	/** PU プルダウン選択形式 */
	PU_PULL_DOWN: '21',
	/** PU テキストボタン形式 */
	PU_TEXT_BUTTON: '22',
	/** PU テキスト選択形式（1列） */
	PU_TEXT_SELECT_LINE_1: '23',
	/** PU テキスト選択形式（2列） */
	PU_TEXT_SELECT_LINE_2: '24',
	/** PU テキスト選択形式（3列） */
	PU_TEXT_SELECT_LINE_3: '25',
	/** PU 画像ボタン形式（1列） */
	PU_IMAGE_BUTTON_LINE_1: '26',
	/** PU 画像ボタン形式（2列） */
	PU_IMAGE_BUTTON_LINE_2: '27',
	/** PU 画像ボタン形式（3列） */
	PU_IMAGE_BUTTON_LINE_3: '28',
	/** PU 数値入力 */
	PU_NUMBER_INPUT: '29',
	/** PU リスト選択方式 */
	PU_LIST_SELECT: '30',
	/** PU ツリー（入れ子）選択形式 */
	PU_LIST_TREE: '31',
} as const;

export interface ParametricUnitPartNumberSpec extends PartNumberSpec {
	specViewType: ValueOf<typeof PUSpecViewType>;
}

export interface ShowableSupplement {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	y: number;
}
