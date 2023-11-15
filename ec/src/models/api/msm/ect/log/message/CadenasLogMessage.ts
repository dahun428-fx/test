/** CADENAS ログメッセージ */
export interface CadenasLogMessage {
	partNumber: string;
	partNumberCadenas: string;
	errorType: string;
	returnedValue: string;
	projectPath: string;
	projectPathCadenas: string;
	seriesCode?: string;
}
