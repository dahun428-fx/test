import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack_origin';
import { CadDownloadStackItem as CadDownloadStackItemCustom } from '@/models/localStorage/CadDownloadStack';
import { useSelector } from '@/store/hooks';
import {
	selectStackShowStatus,
	selectStackTabStatus,
	updateStackShowStatusOperation,
	updateStackTabStatusOperation,
} from '@/store/modules/common/stack';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useStackBalloon = () => {
	const dispatch = useDispatch();
	const stackShowStatus = useSelector(selectStackShowStatus);
	const stackTabStatus = useSelector(selectStackTabStatus);

	const [checkedPendingCad, setCheckedPendingCad] = useState<
		Set<CadDownloadStackItemCustom>
	>(new Set());
	const [checkedDoneCad, setCheckedDoneCad] = useState<
		Set<CadDownloadStackItemCustom>
	>(new Set());

	const [checkedPendingCadId, setCheckedPendingCadId] = useState<Set<string>>(
		new Set()
	);
	const [checkedDoneCadId, setCheckedDoneCadId] = useState<Set<string>>(
		new Set()
	);

	const handleSelectPendingCad = useCallback(
		(pendingCad: CadDownloadStackItemCustom) => {
			const isSelected = checkedPendingCad.has(pendingCad);
			if (isSelected) {
				checkedPendingCad.delete(pendingCad);
			} else {
				checkedPendingCad.add(pendingCad);
			}

			setCheckedPendingCad(new Set(Array.from(checkedPendingCad)));
			console.log(checkedPendingCad);
		},
		[checkedPendingCad]
	);
	const handleSelectDoneCad = useCallback(
		(doneCad: CadDownloadStackItemCustom) => {
			const isSelected = checkedDoneCad.has(doneCad);
			if (isSelected) {
				checkedDoneCad.delete(doneCad);
			} else {
				checkedDoneCad.add(doneCad);
			}

			setCheckedDoneCad(new Set(Array.from(checkedDoneCad)));
			console.log(checkedDoneCad);
		},
		[checkedDoneCad]
	);

	const setStackShowStatus = useCallback(
		(show: boolean) => {
			updateStackShowStatusOperation(dispatch)(show);
		},
		[dispatch]
	);

	const setStackTabDone = useCallback(
		(tabDone: boolean) => {
			updateStackTabStatusOperation(dispatch)(tabDone);
		},
		[dispatch]
	);

	return {
		stackShowStatus,
		stackTabStatus,
		setStackShowStatus,
		setStackTabDone,
		checkedPendingCad,
		// checkedPendingCad: Array.from(checkedPendingCad),
		// ={Array.from(checkedPendingCad)},
		checkedDoneCad,
		// checkedDoneCad: Array.from(checkedDoneCad),
		handleSelectPendingCad,
		handleSelectDoneCad,
	};
};
