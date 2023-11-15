import { useRouter } from 'next/router';
import { CadPreview } from '@/components/pc/pages/CadPreview';
import { ApplicationError } from '@/errors/ApplicationError';
import { Simple } from '@/layouts/pc/simple';
import { Flag } from '@/models/api/Flag';
import { Query as PageQuery } from '@/models/pages/cadPreview';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotEmpty } from '@/utils/assertions';
import { isCadDownloadButtonType } from '@/utils/cad';

/** GET params for pathpida */
export type Query = PageQuery;

/**
 * 3D CAD preview page
 */
const CadPreviewPage: NextPageWithLayout = () => {
	const router = useRouter();
	const {
		brandCode,
		seriesCode,
		partNumber,
		cadId,
		cadDownloadButtonType,
		completeFlag,
		moldExpressType,
		brandName,
		seriesName,
		seriesImage,
	} = router.query;

	if (!router.isReady) {
		return null;
	}

	assertNotEmpty(brandCode);
	assertNotEmpty(seriesCode);
	assertNotEmpty(partNumber);

	if (
		brandCode instanceof Array ||
		seriesCode instanceof Array ||
		(partNumber != null && partNumber instanceof Array) ||
		(cadId != null && cadId instanceof Array) ||
		completeFlag instanceof Array ||
		cadDownloadButtonType instanceof Array ||
		moldExpressType instanceof Array ||
		brandName instanceof Array ||
		seriesName instanceof Array ||
		seriesImage instanceof Array
	) {
		throw new ApplicationError('some params is array');
	}

	if (!completeFlag || !Flag.isFlag(completeFlag)) {
		throw new ApplicationError('wrong value for completeFlag');
	}

	if (
		!cadDownloadButtonType ||
		!isCadDownloadButtonType(cadDownloadButtonType)
	) {
		throw new ApplicationError('wrong value for cadDownloadButtonType');
	}

	if (!brandName) {
		throw new ApplicationError('brandName is empty');
	}

	if (!seriesName) {
		throw new ApplicationError('seriesName is empty');
	}

	if (!seriesImage) {
		throw new ApplicationError('seriesImage is empty');
	}

	return (
		<CadPreview
			{...{
				brandCode,
				seriesCode,
				partNumber,
				cadId,
				cadDownloadButtonType,
				completeFlag,
				moldExpressType: moldExpressType,
				brandName,
				seriesName,
				seriesImage,
			}}
		/>
	);
};
CadPreviewPage.displayName = 'CadPreviewPage';
CadPreviewPage.getLayout = Simple;
export default CadPreviewPage;
