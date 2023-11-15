export const ErrorCode = {
	/** サーバエラー(500) */
	SERVER_ERROR: 'API000000',
	/** 外部APIエラー(500) */
	EXTERNAL_ERROR: 'API000001',
	/** メンテナンス中 */
	UNDER_MAINTENANCE: 'API000002',
	/** 指定したデータが移動 */
	MOVED_PERMANENTLY: 'API000004',
	/** 必須バリデーションエラー */
	REQUIRED: 'API000100',
	/** パラメータ不正 */
	INVALID_PARAMS: 'API000101',
	/** セッションが無効(401) */
	INVALID_SESSION: 'API000202',
	/** 営業時間外(400) */
	OUTSIDE_BUSINESS_HOURS: 'API000203',
	/** 予期しないエラー */
	UNEXPECTED: 'API000204',
	/** 認証 or 権限エラー */
	FORBIDDEN: 'API000208',
} as const;
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
