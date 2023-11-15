import classNames from 'classnames';
import React, { Children, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberMessageList.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { AlertMessage } from '@/components/pc/ui/messages/AlertMessage';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { AlterationSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { isPack } from '@/utils/domain/partNumber';
import { notEmpty } from '@/utils/predicate';

type Props = {
	completeFlag?: Flag;
	cautionList?: string[];
	noticeList?: string[];
	orderDeadline?: string;
	minQuantity?: number;
	piecesPerPackage?: number;
	alterationSpecEnabled?: boolean;
	alterationSpecList?: AlterationSpec[];
	onClickShowOptions: () => void;
	className?: string;
};

export const PartNumberMessageList: React.FC<Props> = ({
	completeFlag,
	cautionList = [],
	noticeList = [],
	orderDeadline,
	minQuantity,
	piecesPerPackage,
	alterationSpecEnabled,
	alterationSpecList = [],
	onClickShowOptions,
	children,
	className,
}) => {
	const { t } = useTranslation();

	const { bool: showsDefaults, toggle } = useBoolState(false);

	const handleDefaultSpecValuesToggle = (event: React.MouseEvent) => {
		event.preventDefault();
		toggle();
	};

	const alterationDefaultSpecList = useMemo(() => {
		if (!notEmpty(alterationSpecList)) {
			return undefined;
		}

		const defaultSpecIncludingList = alterationSpecList.filter(spec =>
			spec.specValueList.some(value => Flag.isTrue(value.defaultFlag))
		);

		return defaultSpecIncludingList.length === 0
			? undefined
			: defaultSpecIncludingList.map(defaultSpec => ({
					specCode: defaultSpec.specCode,
					specName: defaultSpec.specName,
					specValueDisp: defaultSpec.specValueList.find(specValue =>
						Flag.isTrue(specValue.defaultFlag)
					)?.specValueDisp,
			  }));
	}, [alterationSpecList]);

	return (
		<MessageList className={className}>
			{alterationSpecEnabled && notEmpty(alterationSpecList) && (
				<>
					<div>
						<Button size="s" onClick={onClickShowOptions}>
							{t('pages.productDetail.actionsPanel.showMoreOptions')}
						</Button>
					</div>
					{alterationDefaultSpecList && (
						<>
							<div className={styles.alterationSpecExplain}>
								<strong>
									{t(
										'pages.productDetail.actionsPanel.strongNoticeForDefaults'
									)}
								</strong>
								<span>
									{t(
										'pages.productDetail.actionsPanel.additionalNoticeForDefaults'
									)}
								</span>
							</div>
							<p className={styles.defaultSpecToggleBox}>
								<a
									href="#"
									onClick={handleDefaultSpecValuesToggle}
									className={
										showsDefaults
											? styles.defaultsClosable
											: styles.defaultsOpenable
									}
								>
									{showsDefaults
										? t('pages.productDetail.actionsPanel.closeDefaults')
										: t('pages.productDetail.actionsPanel.openDefaults')}
								</a>
							</p>
							<ul
								className={showsDefaults ? styles.defaultSpecList : styles.none}
							>
								{alterationDefaultSpecList.map(defaultSpec => (
									<li key={defaultSpec.specCode}>
										<span
											dangerouslySetInnerHTML={{ __html: defaultSpec.specName }}
										/>
										<span
											className={styles.defaultSpecValueDisp}
											dangerouslySetInnerHTML={{
												__html: defaultSpec.specValueDisp ?? '',
											}}
										/>
									</li>
								))}
							</ul>
						</>
					)}
				</>
			)}
			{cautionList.map((caution, index) => (
				<MessageItem key={index}>
					<AlertMessage key={index} className={styles.message}>
						{caution}
					</AlertMessage>
				</MessageItem>
			))}

			{noticeList.map((notice, index) => (
				<MessageItem key={index}>
					<InformationMessage className={styles.message}>
						{notice}
					</InformationMessage>
				</MessageItem>
			))}

			{Flag.isTrue(completeFlag) && orderDeadline && (
				<MessageItem>
					<InformationMessage className={styles.message}>
						{t('pages.productDetail.actionsPanel.orderDeadline', {
							orderDeadline,
						})}
					</InformationMessage>
				</MessageItem>
			)}

			{Flag.isTrue(completeFlag) && minQuantity && (
				<MessageItem>
					{isPack({ piecesPerPackage }) ? (
						<InformationMessage className={styles.message}>
							{t('pages.productDetail.actionsPanel.orderableMinQuantityPack', {
								minQuantity,
							})}
						</InformationMessage>
					) : (
						<InformationMessage className={styles.message}>
							{t('pages.productDetail.actionsPanel.orderableMinQuantity', {
								minQuantity,
							})}
						</InformationMessage>
					)}
				</MessageItem>
			)}
			{children &&
				Children.map(children, (child, index) => (
					<MessageItem key={index}>{child}</MessageItem>
				))}
		</MessageList>
	);
};
PartNumberMessageList.displayName = 'PartNumberMessageList';

const MessageItem: React.FC = ({ children }) => {
	return <li className={styles.messageItem}>{children}</li>;
};
MessageItem.displayName = 'MessageItem';

const MessageList: React.FC<{ className?: string }> = ({
	children,
	className,
}) => {
	// NOTE: Children#toArray remove "null", "undefined" and "boolean".
	if (!notEmpty(Children.toArray(children))) {
		return null;
	}
	return (
		<ul className={classNames(className, styles.messageList)}>{children}</ul>
	);
};
MessageList.displayName = 'MessageList';
