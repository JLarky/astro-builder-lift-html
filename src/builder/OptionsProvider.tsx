import React from 'react';

const OptionsContext = React.createContext({ isEditing: false });

export function OptionsProvider({
	isEditing,
	children,
}: {
	isEditing: boolean;
	children: React.ReactNode;
}) {
	const value = React.useMemo(() => ({ isEditing }), [isEditing]);
	return (
		<OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>
	);
}

export function useOptions() {
	return React.useContext(OptionsContext);
}

// safe-to-modify stays false during editing hydration so Solid does not
// overwrite the count, then becomes true.
export function useSafeToModify() {
	const { isEditing } = useOptions();
	const [safeToModify, setSafeToModify] = React.useState(!isEditing);
	React.useEffect(() => {
		setSafeToModify(true);
	}, [isEditing]);
	return safeToModify;
}
