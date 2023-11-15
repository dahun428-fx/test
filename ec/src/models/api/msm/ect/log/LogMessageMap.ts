import { LogType } from './AddLogParams';
import {
	CodeFixLogMessage,
	CodeFixSimpleLogMessage,
	SearchLogMessage,
	DetailTabLogMessage,
	VisitLogMessage,
	CadenasLogMessage,
	SimilarLogMessage,
	SpecLogMessage,
} from './message';

export type LogMessageMap = {
	[LogType.VISIT]: VisitLogMessage;
	[LogType.SEARCH]: SearchLogMessage;
	[LogType.CODE_FIX]: CodeFixLogMessage;
	[LogType.SPEC]: SpecLogMessage;
	[LogType.DETAIL_TAB]: DetailTabLogMessage;
	[LogType.SIMILAR]: SimilarLogMessage;
	[LogType.CADENAS]: CadenasLogMessage;
	[LogType.CODE_FIX_SIMPLE]: CodeFixSimpleLogMessage;
};
