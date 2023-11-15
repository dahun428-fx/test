// noUncheckedIndexedAccess を有効にするにあたり、split が過剰に反応しないようにする型定義
// https://github.com/microsoft/TypeScript/issues/41638#issuecomment-1197425762
// https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts
interface String {
	// ''.split('') が [] になる定義
	split(separator: '', limit?: number): string[];
	// その他の場合の一般的な split の定義
	split(separator: string, limit?: number): [string, ...string[]];
}
