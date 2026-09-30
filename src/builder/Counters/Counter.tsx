import styles from './styles.module.css';
import type { Props } from './CounterRC';
import { useOptions } from '../OptionsProvider';
import { useEffect, useState } from 'react';

function Counter(props: Props) {
	const { isEditing } = useOptions();
	const [safeToModify, setSafeToModify] = useState(!isEditing);
	useEffect(() => {
		setSafeToModify(true);
	}, [isEditing]);
	const count = props.initialCount;

	return (
		<my-counter
			class={styles.counter}
			initial-count={count}
			safe-to-modify={safeToModify ? 'true' : 'false'}
		>
			<button data-target="my-counter:dec" className={styles.btn}>
				-
			</button>
			<span className={styles.count} data-target="my-counter:count">
				{count}
			</span>
			<button data-target="my-counter:inc" className={styles.btn}>
				+
			</button>
		</my-counter>
	);
}

export default Counter;
