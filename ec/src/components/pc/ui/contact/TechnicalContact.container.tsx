import { TechnicalContact as Presenter } from '@/components/pc/ui/contact/TechnicalContact';
import styles from './TechnicalContact.module.scss';
import { useTranslation } from 'react-i18next';
import { MouseEvent, useCallback, useRef, useState } from 'react';
import { url } from '@/utils/url';
import { TechnicalContactOpener } from './TechnicalContactOpener/TechnicalContactOpener';
import useOuterClick from '@/hooks/ui/useOuterClick';

export type Props = {
	categoryCode?: string;
	seriesCode?: string;
};
export const TechnicalContact: React.VFC<Props> = ({
	categoryCode,
	seriesCode,
}) => {
	const [shouldShowForm, setShouldShowForm] = useState(false);
	const ref = useRef(null);

	const toggleOpener = useCallback(() => {
		setShouldShowForm(prev => !prev);
	}, []);

	const handleOpenChat = (event: MouseEvent) => {
		event.preventDefault();
	};

	return (
		<section className={styles.container} ref={ref}>
			<TechnicalContactOpener isOpen={shouldShowForm} onClick={toggleOpener} />
			{shouldShowForm && (
				<Presenter
					onOpenChat={handleOpenChat}
					setShouldShowForm={setShouldShowForm}
				/>
			)}
		</section>
	);
};
