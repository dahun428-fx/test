import { ErrorInfo } from 'react';

export type DatadogErrorContext = {
	errorPart: 'rendering on browser' | 'asynchronous code';
	reactErrorInfo?: ErrorInfo;
};
