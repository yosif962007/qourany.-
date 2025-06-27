// storage.js
const Storage = (() => {
    const USERS_KEY = 'islamic_app_users';
    
    // Helper to get all users
    const getAllUsers = () => {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : {};
    };
    
    // Helper to save all users
    const saveAllUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };
    
    return {
        // Save a new user or update an existing one
        saveUser: (username, userData) => {
            const users = getAllUsers();
            if (users[username]) {
                console.warn(`User ${username} already exists. Use updateUserData to modify.`);
                return false;
            }
            // Basic "encryption" for password (Base64 encoding - NOT secure for production)
            const hashedPassword = btoa(userData.password);
            users[username] = { ...userData, password: hashedPassword };
            saveAllUsers(users);
            console.log(`User ${username} saved.`);
            return true;
        },
        
        // Verify user credentials
        verifyUser: (username, password) => {
            const users = getAllUsers();
            const userData = users[username];
            if (userData) {
                // Decode Base64 and compare
                return atob(userData.password) === password;
            }
            return false;
        },
        
        // Check if user exists
        userExists: (username) => {
            const users = getAllUsers();
            return !!users[username];
        },
        
        // Get user data (excluding sensitive info if needed, but here includes all)
        getUserData: (username) => {
            const users = getAllUsers();
            const userData = users[username];
            if (userData) {
                // Return a copy to prevent direct modification of stored data
                // Decode password if needed for internal use, but generally avoid
                return { ...userData, password: atob(userData.password) };
            }
            return null;
        },
        
        // Update existing user data
        updateUserData: (username, newData) => {
            const users = getAllUsers();
            if (!users[username]) {
                console.warn(`User ${username} does not exist to update.`);
                return false;
            }
            const existingData = users[username];
            let updatedData = { ...existingData, ...newData };
            
            // If password is being updated, "encrypt" it
            if (newData.password) {
                updatedData.password = btoa(newData.password);
            }
            
            users[username] = updatedData;
            saveAllUsers(users);
            console.log(`User ${username} updated.`);
            return true;
        },
        
        // Delete a user
        deleteUser: (username) => {
            const users = getAllUsers();
            if (users[username]) {
                delete users[username];
                saveAllUsers(users);
                console.log(`User ${username} deleted.`);
                return true;
            }
            console.warn(`User ${username} not found for deletion.`);
            return false;
        }
    };
})();