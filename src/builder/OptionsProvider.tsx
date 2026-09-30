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

/**
 * Use safe to modify to prevent hydration errors if the web component will change the DOM before React hydrates.
 */
export function useSafeToModify() {
	const { isEditing } = useOptions();
	const [safeToModify, setSafeToModify] = React.useState(!isEditing);
	React.useEffect(() => {
		setSafeToModify(true);
	}, [isEditing]);
	return safeToModify;
}
