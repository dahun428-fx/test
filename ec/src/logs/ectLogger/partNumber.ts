import { addLog } from '@/api/services/addLog';
import { Flag } from '@/models/api/Flag';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { CodeFixLogMessage } from '@/models/api/msm/ect/log/message';

// SpecLogMessage があまりにもな型になっているので定義
type ChangeSpecPayload = {
	/**
	 * シリーズコード
	 * - ect-api log の定義では categoryCode になっているがシリーズコードである。
	 */
	seriesCode: string;
	/**
	 * スペック名
	 * - 子スペックの場合は、親スペックのスペック名を指定する。
	 */
	specName: string;
	/** スペック値表示文言 */
	specValueDisp: string;
	/**
	 * 選択状態
	 * - 0=選択解除操作, 1=選択操作
	 */
	selectedFlag: Flag;
};

export function completePartNumber(payload: CodeFixLogMessage) {
	addLog(LogType.CODE_FIX, payload);
}

export function changeSpec(payload: ChangeSpecPayload) {
	addLog(LogType.SPEC, {
		categoryCode: payload.seriesCode, // <- This is NOT a bug.
		parameterName: payload.specName,
		parameterValue: payload.specValueDisp,
		select: Flag.isTrue(payload.selectedFlag) ? 'ON' : 'OFF',
	});
}
