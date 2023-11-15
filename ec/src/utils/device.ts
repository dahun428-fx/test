import { UAParser } from 'ua-parser-js';

/** View render type */
const ViewType = {
	/** Mobile */
	Mobile: 'sp',
	/** PC */
	PC: 'pc',
	/** Not set */
	NotSet: 'null',
} as const;
type ViewType = typeof ViewType[keyof typeof ViewType];

const ViewTypeReload = {
	Reloaded: '1',
	NeedReload: '0',
} as const;
type ViewTypeReload = typeof ViewTypeReload[keyof typeof ViewTypeReload];

export { ViewType, ViewTypeReload };

/**
 * Check if a device is mobile or not
 * UAParser のバージョン上げたら機能しなくなる可能性がありますので注意。
 */
export function isMobile() {
	const parser = new UAParser();
	const device = parser.getDevice();
	return device.type === 'mobile';
}

/**
 * サポート外の OS かどうかを判定する
 * - 利用箇所：ヘッダ最上部のサポート外メッセージ
 */
export function isNoSupportOS() {
	const parser = new UAParser();
	return !!parser.getUA().match(/Windows NT 6.1/i);
}

/**
 * ブラウザが IE かどうかを判定する
 */
export function isIE() {
	const browser = new UAParser().getBrowser().name?.toLocaleLowerCase();
	return !!browser?.startsWith('ie');
}

/**
 * IE のバージョンを取得する
 * IE でない、もしくはバージョンが取得できない場合は undefined を返す
 */
export function getIEVersion() {
	if (!isIE()) {
		return undefined;
	}

	const version = new UAParser().getBrowser().version;

	return version ? parseInt(version) : undefined;
}

/** IE11 */
export function isIE11() {
	return getIEVersion() === 11;
}

/** Chrome */
export function isChrome() {
	return new UAParser().getBrowser().name?.toLowerCase().startsWith('chrome');
}

/** Firefox */
export function isFirefox() {
	return new UAParser().getBrowser().name?.toLowerCase().startsWith('firefox');
}

/** Edge */
export function isEdge() {
	return new UAParser().getBrowser().name?.toLowerCase().startsWith('edge');
}
