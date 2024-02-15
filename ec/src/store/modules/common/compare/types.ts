const CompareLoadStatus = {
	INITIAL: 0,
	LOADING: 1,
	READY: 2,
} as const;
type CompareLoadStatus =
	typeof CompareLoadStatus[keyof typeof CompareLoadStatus];
export { CompareLoadStatus };
