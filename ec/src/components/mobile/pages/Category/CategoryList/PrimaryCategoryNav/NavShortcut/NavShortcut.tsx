import Link from 'next/link';
import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NavShortcut.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';

type Props = {
	primaryCategoryList: Category[];
	className?: string;
	onClick: (index: number) => void;
};

export const NavShortcut: FC<Props> = ({
	primaryCategoryList,
	onClick,
	className,
}) => {
	const { t } = useTranslation();
	const [isOpen, open, close] = useBoolState(false);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
		event.preventDefault();
		onClick(index);
		close();
	};

	return (
		<div className={className}>
			<button className={styles.opener} aria-label="view all" onClick={open} />
			<div aria-hidden={!isOpen} className={styles.overlay} onClick={close}>
				<div
					className={styles.popover}
					onClick={event => event.stopPropagation()}
				>
					<div className={styles.header}>
						<span className={styles.label}>
							{t('mobile.pages.category.categoryList.navShortcut.popoverLabel')}
						</span>
						<button
							className={styles.closer}
							aria-label="close"
							onClick={close}
						/>
					</div>
					<ul className={styles.list}>
						{primaryCategoryList.map((category, index) => (
							<li key={category.categoryCode}>
								<Link
									href={pagesPath.vona2
										._categoryCode([category.categoryCode])
										.$url()}
								>
									<a
										className={styles.link}
										onClick={event => handleClick(event, index)}
									>
										{category.categoryName}
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
NavShortcut.displayName = 'NavShortcut';
