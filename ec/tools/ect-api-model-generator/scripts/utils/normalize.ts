/**
 * SPACE -> TAB 変換
 * @param outputText 出力文字列
 */
export function convertSpaceToTab(text: string) {
	// TODO: api-model-generatorのようにconfig定義すべき...?
	const tabStop = 4;
	const lines = text.split(`\n`).map((line) => {
		const count = getLeftSpaceCount(line);
		// NOTE: コメント行の場合に四捨五入するための parseInt
		const tabCount = parseInt((count / tabStop).toString());

		if (tabCount) {
			const charCount = tabCount * tabStop;
			const tabs = [...Array(tabCount)].map(() => `\t`).join();
			return `${tabs}${line.substring(charCount)}`;
		}
		return line;
	});
	return lines.join(`\n`);
}

/** 行頭のスペース文字をカウント */
function getLeftSpaceCount(line: string) {
	return line.length - line.trimLeft().length;
}
