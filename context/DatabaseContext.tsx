import React, { createContext, useState, useEffect, useMemo } from 'react';
import { DatabaseService } from '../services/DatabaseService';

interface DatabaseContextProps {
	databaseService: DatabaseService;
}

export const DatabaseContext = createContext<DatabaseContextProps | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [databaseService] = useState(DatabaseService.getInstance());

	useEffect(() => {
		const initialize = async () => {
			try {
				await databaseService.initializeDatabase();
			} catch (e) {
				console.error('Database init failed', e);
			}
		};
		initialize();
	}, []);

	const value = useMemo(() => ({ databaseService }), [databaseService]);

	return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};
