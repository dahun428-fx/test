import classNames from 'classnames';
import { useEffect, useRef, useState, VFC } from 'react';
import styles from './CategoryDescription.module.scss';

type Props = {
	categoryName: string;
	categoryDetail: string | undefined;
};

/** Category description component */
export const CategoryDescription: VFC<Props> = ({
	categoryName,
	categoryDetail,
}) => {
	const [showReadMore, setShowReadMore] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const handleClickReadMore = (event: React.MouseEvent) => {
		event.preventDefault();
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		if (!descriptionRef.current) {
			return;
		}

		const isTextOverflowed = (element: HTMLElement) => {
			// 要素のスクロール幅、高さを取得
			const scrollHeight = element.scrollHeight;
			const clientHeight = element.clientHeight;
			// テキストのオーバーフローを判定
			const isOverflowed = scrollHeight > clientHeight;
			return isOverflowed;
		};

		setShowReadMore(isTextOverflowed(descriptionRef.current));
	}, [categoryDetail]);

	if (!categoryDetail) {
		return null;
	}

	return (
		<div className={classNames(styles.descriptionBox, {})}>
			<h1 className={styles.title}>{categoryName}</h1>
			<div>
				<div
					className={styles.description}
					data-expanded={isOpen}
					ref={descriptionRef}
				>
					<span
						dangerouslySetInnerHTML={{
							__html: categoryDetail,
						}}
					/>
					{showReadMore && (
						<span
							className={classNames(styles.readMoreLink, {
								[String(styles.closeReadMore)]: isOpen,
								[String(styles.openReadMore)]: !isOpen,
							})}
							onClick={handleClickReadMore}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
CategoryDescription.displayName = 'CategoryDescription';
