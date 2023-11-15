import { MsmApiParams } from '@/models/api/msm/MsmApiParams';

/** ログ保存パラメータ */
export interface AddLogParams extends MsmApiParams {
	logType: LogType;
}

/** ログタイプ */
const LogType = {
	VISIT: '1',
	SEARCH: '3',
	CODE_FIX: '4',
	SPEC: '5',
	DETAIL_TAB: '6',
	SIMILAR: '7',
	/**
	 * CADダウンロードエラー
	 * CADENAS となっているが、SINUS でも利用
	 */
	CADENAS: '9',
	/**
	 * - 2023/1/12 マレーシアのPC版商品詳細単純系画面では送信不要。モバイルは不明。
	 *   https://tickets.tools.misumi.jp/jira/browse/NEW_FE-3080
	 */
	CODE_FIX_SIMPLE: '10',
	// ...
} as const;
type LogType = typeof LogType[keyof typeof LogType];

export { LogType };
