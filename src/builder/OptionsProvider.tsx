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
