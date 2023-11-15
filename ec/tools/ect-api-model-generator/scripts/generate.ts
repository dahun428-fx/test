/* eslint-disable */
import { ColumnMap, Model, Property } from './types';
import xlsx from 'xlsx';
import {
	between,
	getColumnIndex,
	getProperty,
	getRow,
	getRowIndex,
	getTopBottom,
	nextColumnIndex,
} from './utils/sheet';
import { convertSpaceToTab } from './utils/normalize';
import { notNull } from './utils/predecator';
import fs from 'fs-extra';
import path from 'path';
import mustache from 'mustache';

/** シート名 */
const REQUEST_SHEET_NAME = `リクエスト項目一覧`;
const RESPONSE_SHEET_NAME = `レスポンス項目一覧`;
const API_PATH_SHEET_NAME = `リクエスト先`;

/** generated ファイルディレクトリ */
const GENERATED_API_PATH = `../../../ec/src/models/api/msm/ect/`;

// template ディレクトリ
const TEMPLATE_DIR_PATH = path.join(__dirname, `../templates`);

/** リクエスト項目一覧の列情報 */
const REQUEST_COLUMNS = [
	'分類',
	'項目名(論理名)',
	'項目名(物理名)',
	'型',
	'必須',
	'最小',
	'最大',
	'デフォルト値',
	'説明',
	'サンプル',
	'備考',
] as const;

/** レスポンス項目一覧の列情報 */
const RESPONSE_COLUMNS = [
	'分類',
	'項目名(論理名)',
	'項目名(物理名)',
	'型',
	'必須',
	'桁数',
	'項目グループ',
	'説明',
	'サンプル',
	'備考',
] as const;

/** リクエスト項目一覧の除外対象の分類 */
const REQUEST_SKIP_CLASS = ['認証', '共通'];

// template
// request
const requestTemplate = fs.readFileSync(
	path.join(TEMPLATE_DIR_PATH, `request.mustache`),
	`utf-8`
);
// response
const responseTemplate = fs.readFileSync(
	path.join(TEMPLATE_DIR_PATH, `response.mustache`),
	`utf-8`
);
// model variable line
const propertyTemplate = fs.readFileSync(
	path.join(TEMPLATE_DIR_PATH, `property.mustache`),
	`utf-8`
);

/** ファイル読み取り */
function read(filePath: string) {
	return xlsx.readFile(filePath);
}

/**
 * シートの解析・モデルを生成
 * @param {xlsx.WorkSheet} sheet - シート
 * @param {string} sheetName - シート名
 * @param {ReadonlyArray<string>} extractColumns - 抽出対象の項目
 * @param modelContext - モデルの内容（物理名、項目名）
 */
function produce(
	sheet: xlsx.WorkSheet,
	sheetName: string,
	extractColumns: ReadonlyArray<string>,
	modelContext: { logicalName: string; name: string }
) {
	const columnMap = getColumnMap(sheet, sheetName, extractColumns);
	const table = getTable(sheet, sheetName, columnMap);

	// テーブルの最初と最後の行
	const [from, to] = getTopBottom(table);

	return produceModels({
		table,
		position: { column: columnMap['項目名(論理名)'], from, to },
		columnMap,
		modelContext: { ...modelContext, root: true },
	});
}

/**
 * シートから不要な情報を除外して、レスポンス定義の表を取得します
 * @param {xlsx.WorkSheet} sheet - シート
 * @param sheetName - シート名
 * @param columnMap - 列情報
 * @returns {xlsx.WorkSheet} レスポンス定義表
 */
function getTable(
	sheet: xlsx.WorkSheet,
	sheetName: string,
	columnMap?: ColumnMap
): xlsx.WorkSheet {
	// NOTE: 「+ 2」はヘッダーの２行を含めないための加算
	let fromRowIndex = getTableTitleRowIndex(sheet, `◆${sheetName}`) + 2;

	// NOTE: リクエストは一部の分類を除くため、分類の値を見て開始行を設定する
	if (sheetName.includes(`リクエスト`)) {
		// TODO: この辺はスッキリ書きたい...
		const table = Object.fromEntries(
			Object.entries(sheet).filter(
				([key]) => !key.includes('!') && getRowIndex(key) > fromRowIndex
			)
		);
		// 分類行の値がスキップ対象から外れたら開始行に設定
		for (const key in sheet) {
			const rowIndex = getRowIndex(key);
			const row = getRow(table, rowIndex);
			const cellValue = row[columnMap!['分類']];
			if (!REQUEST_SKIP_CLASS.includes(cellValue) && !!cellValue) {
				fromRowIndex = rowIndex - 1;
				break;
			}
		}
	}
	return Object.fromEntries(
		Object.entries(sheet).filter(
			([key]) => !key.includes('!') && getRowIndex(key) > fromRowIndex
		)
	);
}

/**
 * テーブルタイトルの行番号を取得します。
 * @param {xlsx.WorkSheet} sheet - シート
 * @param {string} keyword - タイトルキーワード
 */
function getTableTitleRowIndex(sheet: xlsx.WorkSheet, keyword: string) {
	for (let i = 1; i < 500; i++) {
		const cell = sheet[`A${i}`];
		if (cell && cell.v?.includes(keyword)) {
			return i;
		}
	}
	throw Error(`対象のキーワードが見つかりませんでした。`);
}

/**
 * モデル生成
 * @param table 表
 * @param position 表内の位置を指し示す
 * @param columnMap
 * @param modelContext モデル名などモデル情報を保持する
 */
function produceModels({
	table,
	position: { column, from, to },
	columnMap,
	modelContext,
}: {
	table: xlsx.WorkSheet;
	position: { column: string; from: number; to: number };
	columnMap: ColumnMap;
	modelContext: { name: string; logicalName: string; root?: boolean };
}) {
	const models: Model[] = [];

	// 指定の列、指定の行(from-to)に存在する項目行を取得
	const rowIndexes = Object.keys(table)
		.filter((key) => getColumnIndex(key) === column)
		.map((key) => getRowIndex(key))
		.filter((rowIndex) => between(rowIndex, from, to))
		.sort((left, right) => left - right);

	// 上記で取得した、項目をプロパティに変換する
	const properties = rowIndexes
		.map((rowIndex) => ({ rowIndex, row: getRow(table, rowIndex) }))
		.map(({ rowIndex, row }, i, rows) =>
			getProperty(row, columnMap, column, {
				from: rowIndex + 1,
				to: rows[i + 1]?.rowIndex ?? to,
			})
		);

	models.push({ ...modelContext, properties });
	// from-to を求めて再帰的に model 生成して突っ込む
	properties
		.map(({ childDef }) => childDef)
		.filter(notNull)
		.forEach(({ from, to, name, logicalName }) => {
			models.push(
				...produceModels({
					table,
					columnMap,
					position: { column: nextColumnIndex(column), from, to },
					modelContext: { name, logicalName },
				})
			);
		});

	return models;
}

/**
 * タイトルと列番号をマッピングします。
 * @param sheet {xlsx.WorkSheet} シート
 * @param sheetName シート名
 * @param columns 抽出対象の項目
 */
function getColumnMap(
	sheet: xlsx.WorkSheet,
	sheetName: string,
	columns: ReadonlyArray<string>
): Record<string, string> {
	const headerRow = getTableTitleRowIndex(sheet, `◆${sheetName}`) + 1;
	return Object.fromEntries(
		Object.entries(sheet)
			.filter(
				([key, cell]) =>
					between(getRowIndex(key), headerRow, headerRow + 1) &&
					(columns.includes(cell.v) || cell.v.startsWith('@'))
			)
			.map(([key, cell]) => [cell.v, getColumnIndex(key)])
	);
}

/**
 * ファイル出力
 * @param models モデル
 * @param apiPath API のパス
 */
function write(models: Model[], apiPath: string) {
	// ディレクトリ生成
	const outputPath = `${GENERATED_API_PATH}${apiPath}`;
	const { name } = models.filter((model) => model.root)[0];
	const outputText = convertOutputText(models);

	// ディレクトリ・ファイル生成
	fs.mkdirSync(outputPath, { recursive: true });
	fs.writeFileSync(
		path.join(outputPath, `${name}.ts`),
		convertSpaceToTab(outputText)
	);
	console.log(`${outputPath}/${name}.ts`);
}

/**
 * 出力文字列を生成します
 * @param models モデル
 */
function convertOutputText(models: Model[]) {
	const template = models
		.filter((model) => model.root)[0]
		.name.includes(`Request`)
		? requestTemplate
		: responseTemplate;

	return mustache.render(
		template,
		{
			imports: generateImports(models),
			interfaces: getOutputInterface(models),
			template,
		},
		{ property: propertyTemplate }
	);
}

/**
 * 必要な import 文を生成します。
 * @param models モデル
 */
function generateImports(models: Model[]) {
	const paths = [];
	flagPropExists(models) &&
		paths.push(`import { Flag } from '@/models/api/Flag';`);
	return paths;
}

/**
 * Flag型のプロパティがあるかどうか
 * @param models モデル
 */
function flagPropExists(models: Model[]) {
	for (const model of models) {
		if (model.properties.find((property) => property.type === `Flag`)) {
			return true;
		}
	}
	return false;
}

/**
 * 出力用コメント生成
 * @param logicalName 論理名
 * @param property プロパティ
 */
function getOutputDescriptions(
	logicalName: string,
	property?: Partial<Property>
) {
	return [logicalName, ...(property?.descriptions ?? [])];
}

/**
 * 出力用 model 生成
 * @param properties プロパティ
 */
function getOutputModels(properties: Property[]) {
	return properties.map((prop) => {
		return {
			descriptions: getOutputDescriptions(prop.logicalName, { ...prop }),
			name: prop.name,
			required: prop.required,
			dataType: prop.type,
		};
	});
}

/**
 * 出力用 interface 生成（ルート以外のinterfaceを生成して返します）
 * @param models モデル
 */
function getOutputInterface(models: Model[]) {
	return models.map((model) => ({
		descriptions: getOutputDescriptions(model.logicalName),
		name: model.name,
		properties: getOutputModels(model.properties),
		root: model.root,
	}));
}

/**
 * モデルの情報取得
 * @param document ドキュメント
 * @param fileName ファイル名
 */
function getModelContext(document: xlsx.WorkBook, fileName: string) {
	const sheet = document.Sheets[API_PATH_SHEET_NAME];

	// URLを探す
	const cell = Object.fromEntries(
		Object.entries(sheet)
			.filter(([, cell]) => !!cell.v && cell.v.includes(`https://`))
			.map(([, cell]) => [`url`, cell.v])
	);

	if (cell) {
		const [apiType, functionName = `Get`] = cell.url
			.replace(`https://ドメイン名/api/v1/`, ``)
			.split(`/`)
			.map(
				(value: string) => `${value.charAt(0).toUpperCase()}${value.substr(1)}`
			);

		const name = fileName.match(/(?<=\().*?(?=\))/);
		if (!name) {
			// NOTE: インターフェース名がファイル名から取得できないの意
			throw Error(`ファイル名がありません`);
		}

		return {
			name: name[0],
			path: `${apiType.charAt(0).toLowerCase()}${apiType.substr(1)}`,
			request: {
				logicalName: `${name[0]}APIリクエスト`,
				name: `${functionName}${apiType}Request`,
			},
			response: {
				logicalName: `${name[0]}APIレスポンス`,
				name: `${functionName}${apiType}Response`,
			},
		};
	}
	throw Error(`リクエスト先URLが見当たりません。`);
}

/**
 * 指定のAPI外部設計書から、Typescript I/F ファイルを作成します。
 * @param filePath 設計書のパス
 */
export function generate(filePath: string) {
	const doc = read(filePath);
	// String#split の仕様上、separator が何かしらある場合は、空配列にはならないので、not null.
	const fileName = filePath.split('/').pop()!;
	const modelContext = getModelContext(doc, fileName);

	console.log(`==============${modelContext.name} API=============`);

	// リクエスト項目一覧 解析、出力
	const requestModel = produce(
		doc.Sheets[REQUEST_SHEET_NAME],
		REQUEST_SHEET_NAME,
		REQUEST_COLUMNS,
		{
			...modelContext.request,
		}
	);
	write(requestModel, modelContext.path);

	// レスポンス項目一覧 解析、出力
	const responseModel = produce(
		doc.Sheets[RESPONSE_SHEET_NAME],
		RESPONSE_SHEET_NAME,
		RESPONSE_COLUMNS,
		{
			...modelContext.response,
		}
	);
	write(responseModel, modelContext.path);
}
