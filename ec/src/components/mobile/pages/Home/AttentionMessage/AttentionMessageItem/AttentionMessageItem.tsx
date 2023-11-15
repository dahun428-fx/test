import React, {
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AttentionMessageItem.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';
import { ga } from '@/logs/analytics/google';
import {
	MaintenanceMessage,
	MessageType,
} from '@/models/api/cms/home/GetAttentionsResponse';
import { getChildren } from '@/utils/dom';

export const Icons = [
	'warning',
	'info',
	'red-dot',
	'blue-dot',
	'none',
] as const;
export type Icon = typeof Icons[number];

export const TextColors = ['black', 'red'] as const;
export type TextColor = typeof TextColors[number];

type Props = {
	icon: Icon;
	attentionMessage: MaintenanceMessage;
	textColor: TextColor;
};

/** Message item component */
export const AttentionMessageItem: React.VFC<Props> = ({
	attentionMessage,
	icon,
	textColor,
}) => {
	const [t] = useTranslation();
	const { bool: expanded, toggle } = useBoolState(false);
	const [overflow, setOverflow] = useState(true);

	const handleClickTrigger = useCallback(
		(event: MouseEvent) => {
			event.preventDefault();
			toggle();

			if (expanded) {
				ga.events.showMoreAttention();
			}
		},
		[expanded, toggle]
	);

	const containerRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			const [textElement] = getChildren(containerRef.current);
			setOverflow(
				textElement != null &&
					textElement.scrollWidth > containerRef.current.clientWidth
			);
		}
	}, []);

	return (
		<li
			className={styles.messageItem}
			data-icon={icon}
			data-text-color={textColor}
			data-expanded={expanded}
			ref={containerRef}
		>
			<span
				className={styles.text}
				dangerouslySetInnerHTML={{ __html: attentionMessage.message }}
			/>
			{overflow && (
				<div className={styles.moreWrap}>
					<a
						href="#"
						className={styles.more}
						data-theme={
							attentionMessage.messageType === MessageType.Info
								? 'info'
								: 'default'
						}
						onClick={handleClickTrigger}
					>
						{expanded
							? t('mobile.pages.home.attentionMessage.hide')
							: t('mobile.pages.home.attentionMessage.show')}
					</a>
				</div>
			)}
		</li>
	);
};

AttentionMessageItem.displayName = 'AttentionMessageItem';
