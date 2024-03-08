import { GetServerSideProps, NextPage } from 'next';
import { Query as PageQuery } from '@/models/pages/cadPreview';

/** GET params for pathpida */
export type Query = PageQuery;

/**
 * 3D CAD preview page
 */
const CadPreviewPage: NextPage = () => {
	// pathpida の都合でこのファイルが必要ですが、mobile には存在しないページのため null を返しています。
	return null;
};
CadPreviewPage.displayName = 'CadPreviewPage';
export default CadPreviewPage;

export const : GetServerSideProps
	return { notFound: true };
};
