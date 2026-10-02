import { useEffect } from 'react';
import { useOptions, useSafeToModify } from '../OptionsProvider';
import type { Props } from './FaqReactRC';

function FaqReact({ title, items }: Props) {
	const safeToModify = useSafeToModify();
	const { outlet } = useOptions();
	console.log(
		'FaqReact gets updates from Builder editor and only title is going to be updated in the DOM of the preview editor',
		{ title, items },
	);
	useEffect(() => {
		const el = document.querySelector('[aria-label="Tabbed FAQ"]')?.firstChild;
		if (el && safeToModify) {
			el.textContent = title ?? '';
		}
	}, [title, safeToModify]);
	return <>{outlet}</>;
}

export default FaqReact;
