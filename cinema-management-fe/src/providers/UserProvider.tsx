import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserContextType {
    getUserById: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    ]);

    const getUserById = (id: string): User | undefined => {
        return users.find(user => user.id === id);
    };

    return (
        <UserContext.Provider value={{ getUserById }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
};

export default UsersProvider;