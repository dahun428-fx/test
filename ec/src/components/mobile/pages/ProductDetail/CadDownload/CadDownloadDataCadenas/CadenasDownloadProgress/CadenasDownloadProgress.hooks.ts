import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ectLogger } from '@/logs/ectLogger';
import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack';
import { assertNotNull } from '@/utils/assertions';
import { downloadCadLink } from '@/utils/cad';
import { url } from '@/utils/url';

/** CAD download hook */
export const useCadDownloadStatus = () => {
	const [t] = useTranslation();

	const cadDownload = useCallback(
		async (stackItem: CadDownloadStackItem) => {
			try {
				assertNotNull(stackItem.downloadHref);
				downloadCadLink(
					url.cadDownload(stackItem.downloadHref, stackItem.fileName)
				);
				ectLogger.cad.download(stackItem, t);
			} catch {
				// noop
			}
		},
		[t]
	);

	return { cadDownload };
};
