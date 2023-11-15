/* eslint-disable */

import xlsx from 'xlsx';
import { Property, RowData, ColumnMap } from '../types';
import { notEmpty } from './predecator';

/**
 * 行番号を取得します。
 * @param coordinate 行 & 列番号
 * @example
 * getRowIndex('B10') // 10
 */
export function getRowIndex(coordinate: string) {
	return Number(coordinate.replace(/[A-Z]+/, ``));
}

/**
 * 列番号を取得します。
 * @param coordinate 行 & 列番号
 * @example
 * getColumnIndex('B10') // B
 */
export function getColumnIndex(coordinate: string) {
	return coordinate.replace(/[0-9]+/, ``);
}

/**
 * 次の列番号を取得します。
 * @param columnIndex 列番号
 * @example
 * nextColumn('A') // B
 */
export function nextColumnIndex(columnIndex: string) {
	return String.fromCharCode(columnIndex.charCodeAt(0) + 1);
}

/**
 * 指定の値が、指定の範囲内かどうか
 * @param v 指定の行もしくは列番号
 * @param from 開始行、もしくは開始列番号
 * @param to 終了行、もしくは終了列番号
 * @example
 * between(10, 10, 12) // true
 * between(9, 10, 12) // false
 * between(13, 10, 12) // false
 */
export function between(v: number, from: number, to: number) {
	return v >= from && to >= v;
}

export function getTopBottom(table: xlsx.WorkSheet) {
	const rows = Object.keys(table).map((key) => getRowIndex(key));
	return [Math.min(...rows), Math.max(...rows)];
}

/**
 * 行情報を取得します。
 *
 * @param table 表
 * @param rowIndex 行番号
 */
export function getRow(table: xlsx.WorkSheet, rowIndex: number): RowData {
	// NOTE: 以下のようなモデルに変換する
	// { B: `シリーズリスト`, F: seriesList, ... }
	return Object.fromEntries(
		Object.entries(table)
			// 行番号の一致するデータ取得
			.filter(([key]) => getRowIndex(key) === rowIndex)
			.map(([key, cell]) => [getColumnIndex(key), cell.v])
	);
}

/**
 * 行情報をプロパティ情報として変換します。
 * @param row 行情報
 * @param columnMap タイトルと列番号のマッピング
 * @param propNameColumn
 * @param childRowIndexes
 */
export function getProperty(
	row: RowData,
	columnMap: Record<string, string>,
	propNameColumn: string,
	childRowIndexes?: { from: number; to: number }
): Property {
	const name = row[columnMap['項目名(物理名)']];
	const logicalName = row[propNameColumn];
	const { type, childType } = convertType(row[columnMap['型']], name);
	const descriptions = convertDescriptions(row, columnMap);

	return {
		name,
		// NOTE: ２種類の丸が使われていた...
		required: ['○', '◯'].includes(row[columnMap['必須']]),
		descriptions,
		logicalName,
		type,
		childDef:
			childType && childRowIndexes
				? {
						name: childType,
						logicalName: logicalName.replace(`リスト`, ``),
						...childRowIndexes,
				  }
				: undefined,
	};
}

/**
 * タイプ変換
 *
 * @param {string} type - 型
 * @param {string} name - 項目名(物理名)
 */
function convertType(type: string, name: string) {
	if (['List', 'Map'].includes(type)) {
		const typeName =
			name.charAt(0).toUpperCase() + name.slice(1).replace(/List$/, ``);
		return {
			type: type === 'List' ? `${typeName}[]` : typeName,
			childType: typeName,
		};
	}
	if (name.match(/Flag$/)) {
		return { type: `Flag` };
	}
	const map: Record<string, string> = {
		String: 'string',
		Integer: 'number',
		Float: 'number',
		Double: 'number',
		'List<String>': 'string[]',
		'List<Integer>': 'number[]',
		'List<Float>': 'number[]',
		'List<Double>': 'number[]',
	};
	return { type: map[type] };
}

/**
 * 説明に最小、最大、デフォルト値を追加
 * @param row 行情報
 * @param columnMap タイトルと列番号のマッピング
 */
function convertDescriptions(row: RowData, columnMap: ColumnMap) {
	const description = row[columnMap['説明']];
	const minLength = row[columnMap['最小']];
	const maxLength = row[columnMap['桁数']] ?? row[columnMap['最大']];
	const defaultValue = row[columnMap['デフォルト値']];
	const example = row[columnMap['サンプル']];
	const fieldGroups = getFieldGroups(row, columnMap);
	const note = row[columnMap['備考']];

	return [
		// NOTE: 空白行を出力しないようにする。
		...(description ? `- ${description}` : ``)
			.split(`\n`)
			.map((line) => line.trim())
			.filter(notEmpty)
			.map((line, index) => (index !== 0 ? `  ${line}` : line)),
		!!minLength ? `- minLength: ${minLength}` : null,
		!!maxLength ? `- maxLength: ${maxLength}` : null,
		!!defaultValue ? `- default: ${defaultValue}` : null,
		!!example
			? `- example: ${String(example).replace(/[\n\r]+/g, ', ')}`
			: null,
		fieldGroups.length > 0 ? `- field groups: ${fieldGroups.join(`, `)}` : null,
		...(note ? `- NOTE: ${note}` : ``)
			.split(`\n`)
			.map((line) => line.trimRight())
			.filter(notEmpty)
			.map((line, index) => (index !== 0 ? `        ${line}` : line)),
	].filter(notEmpty);
}

/**
 * 指定の項目が属する項目グループ群を取得する。
 * 項目グループが一つ以下の場合は、空、項目グループが複数の場合は、属する項目グループ群。
 *
 * @param row 行データ
 * @param columnMap タイトルと列番号のマッピング
 */
function getFieldGroups(row: RowData, columnMap: ColumnMap) {
	const apiFieldGroups = Object.entries(columnMap).filter(([key, column]) =>
		key.startsWith('@')
	);
	// NOTE: グループが一つ以下の場合は、出力しない。
	if (apiFieldGroups.length <= 1) {
		return [];
	}
	return apiFieldGroups
		.filter(([key, column]) => !!row[column])
		.map(([key]) => key);
}
