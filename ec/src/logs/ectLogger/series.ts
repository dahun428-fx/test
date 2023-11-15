import { addLog } from '@/api/services/addLog';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';

type ChangeSpecPayload = {
	/**
	 * カテゴリコード
	 */
	categoryCode: string;
	/**
	 * スペック名
	 * - 子スペックの場合は、親スペックのスペック名を指定する。
	 */
	specName: string;
	/** スペック値表示文言 */
	specValueDisp: string;
	/**
	 * 選択状態
	 */
	selected: boolean;
};

export function changeSpec(payload: ChangeSpecPayload) {
	addLog(LogType.SPEC, {
		categoryCode: payload.categoryCode,
		parameterName: payload.specName,
		parameterValue: payload.specValueDisp,
		select: payload.selected ? 'ON' : 'OFF',
	});
}
