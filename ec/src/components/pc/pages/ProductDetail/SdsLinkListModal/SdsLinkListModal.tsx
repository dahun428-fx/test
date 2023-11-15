import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SdsLinkListModal.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Link } from '@/components/pc/ui/links';
import { Modal, ModalCloser } from '@/components/pc/ui/modals';
import { Msds } from '@/models/api/msm/ect/series/shared';

type Props = {
	msdsList: Msds[];
};

/**
 * SDS(MSDS) PDF link list modal
 */
export const SdsLinkListModal: VFC<Props> = ({ msdsList }) => {
	const [t] = useTranslation();

	return (
		<Modal>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3 className={styles.headerTitle}>
						{t('pages.productDetail.sdsLinkListModal.title')}
					</h3>
				</div>
				<ul className={styles.listBox}>
					{msdsList.map(msds => (
						<li key={msds.productCode}>
							<Link
								href={msds.url ?? ''}
								target="_blank"
								key={msds.productCode}
							>
								{msds.productCode}
							</Link>
						</li>
					))}
				</ul>
				<div className={styles.buttonBox}>
					<ModalCloser>
						<Button>{t('pages.productDetail.sdsLinkListModal.cancel')}</Button>
					</ModalCloser>
				</div>
			</div>
		</Modal>
	);
};

SdsLinkListModal.displayName = 'SdsLinkListContent';
