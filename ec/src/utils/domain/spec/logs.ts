import { SendLogPayload } from './types';
import { NormalizedSpec } from '@/utils/domain/spec/types';

type SendNumericSpecLogPayload = {
	/** Numeric spec value from NumericSpecField */
	specValue: string;
	/** Previous spec */
	prevSpec: NormalizedSpec;
	/** Send log function */
	sendLog: (payload: SendLogPayload) => void;
};

export function getNumericSpecLogList(
	specValue: string,
	prevSpec: NormalizedSpec
) {
	const prevSpecValue = prevSpec.numericSpec?.specValue;
	const logList: SendLogPayload[] = [];

	if (specValue) {
		// 今回の入力がある場合は、
		// 前回の入力がある場合のみ、前回入力の選択解除ログを送る
		if (prevSpecValue) {
			logList.push({
				specName: prevSpec.specName,
				specValueDisp: prevSpecValue,
				selected: false,
			});
		}

		// 今回の入力がある場合、選択ログは毎回送る
		logList.push({
			specName: prevSpec.specName,
			specValueDisp: specValue,
			selected: true,
		});
	} else {
		// 今回の入力が空の場合は、
		// 前回の入力がある場合のみ、前回入力の選択解除ログを送る
		if (prevSpecValue) {
			logList.push({
				specName: prevSpec.specName,
				specValueDisp: prevSpecValue,
				selected: false,
			});
		}
	}

	return logList;
}

// TODO: PC 側もリファクタして mobile に合わせ、このメソッドを消す
export function sendNumericSpecLog({
	specValue,
	prevSpec,
	sendLog,
}: SendNumericSpecLogPayload) {
	getNumericSpecLogList(specValue, prevSpec).forEach(log => sendLog(log));
}
