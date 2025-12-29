// Simple in-memory user storage (use database in production)
const users = new Map();

// Initialize with some demo users
users.set('user1@example.com', {
    id: 'user_1',
    name: 'John Artist',
    email: 'user1@example.com',
    plan: 'Creator',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-20T14:30:00Z'
});

users.set('user2@example.com', {
    id: 'user_2',
    name: 'Jane Producer',
    email: 'user2@example.com',
    plan: 'Record Label',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    lastLogin: '2024-01-19T16:45:00Z'
});

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Simple admin auth check
    const adminAuth = req.headers.authorization;
    if (!adminAuth || adminAuth !== 'Bearer admin_token') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { method } = req;
    const { userId } = req.query;
    
    if (method === 'GET') {
        // Get all users or specific user
        if (userId) {
            const user = Array.from(users.values()).find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(user);
        }
        
        // Return all users
        const allUsers = Array.from(users.values());
        return res.status(200).json({ users: allUsers, total: allUsers.length });
    }
    
    if (method === 'POST') {
        // Create new user
        const { name, email, plan = 'Creator' } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        if (users.has(email)) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        const newUser = {
            id: 'user_' + Date.now(),
            name,
            email,
            plan,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        users.set(email, newUser);
        return res.status(201).json(newUser);
    }
    
    if (method === 'PUT' && userId) {
        // Update user
        const user = Array.from(users.values()).find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { name, plan, status } = req.body;
        const updatedUser = {
            ...user,
            ...(name && { name }),
            ...(plan && { plan }),
            ...(status && { status })
        };
        
        users.set(user.email, updatedUser);
        return res.status(200).json(updatedUser);
    }
    
    if (method === 'DELETE' && userId) {
        // Delete user
        const user = Array.from(users.values()).find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        users.delete(user.email);
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}