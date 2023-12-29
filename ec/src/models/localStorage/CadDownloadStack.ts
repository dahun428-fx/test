import { GetGenerationStatusResponse } from '@/models/api/cadenas/generationStatus/GetGenerationStatusResponse';
import { DownloadCadRequest } from '@/models/api/sinus/cad/DownloadCadRequest';
import { DynamicCadModifiedCommon } from '@/models/domain/cad';

/**
 * CAD Download Stack
 * - CAD Download 状況データモデル？
 */
export interface CadDownloadStack {
	/** 表示する否か */
	show: boolean;

	/** DL中,済,Error,Timeout アイテムリスト */
	items: CadDownloadStackItem[];

	/** 表示対象全体数 */
	len: number; // 2,

	/** seed ? */
	seed?: number; // 0.5761020820950986, 桁数・・・？

	/**
	 * DL完了数
	 * FIXME: Error も完了数に入る？
	 */
	done: number; // 1,

	/** common ?? */
	common?: string; // {}??
	shouldConfirm: boolean;
	tabDone: boolean; //tab : 다운로드 대기 ( false ), 다운로드 완료 ( true )
}

/**
 * Cad download stack item
 */
export interface CadDownloadStackItem {
	type?: string; // sinus 出ない場合は、cadenas
	expiry?: number;
	url: string;
	from: string;
	time?: string; // 5,
	partNumber: string; // "LX3005-B1-A3040-125",
	id: string; // b6031e3a-639d-4358-9af1-eef0db8288a8",
	label: string; // "DWF V5.5, ASCII",
	seriesName: string;
	seriesCode: string;
	fileName: string; // LX3005-B1-A3040-125_DWF_V5.5,_ASCII_20220314",
	progress: number; // 1,
	created: number; // 1647223061501,
	status: CadDownloadStatus; // pending or done
	requestData?: DownloadCadRequest;
	dynamicCadModifiedCommon: DynamicCadModifiedCommon;
	data?: GetGenerationStatusResponse;
	selected?: SelectedCadDataFormat;
	cadSection: string; // TODO: limit the value setting by type ('PT', 'PCAD' etc...)
	cadFilename: string;
	cadFormat: string;
	cadType: string;
	downloadHref?: string;
	downloadUrl: string;
	checkOnStack: boolean; // stack checked or unchecked ( true / false )
}

export interface SelectedCadDataFormat {
	grp?: string;
	formatText?: string;
	formatOthersText?: string;
	format?: string;
	formatOthers?: string;
	version?: string;
	versionText?: string;
}

const CadDownloadStatus = {
	Putsth: 'putsth',
	Pending: 'pending',
	Done: 'done',
	Timeout: 'timeout',
	Error: 'error',
} as const;
type CadDownloadStatus =
	typeof CadDownloadStatus[keyof typeof CadDownloadStatus];

export { CadDownloadStatus };
