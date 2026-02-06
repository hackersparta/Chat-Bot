export interface UserSession {
    location?: 'India' | 'UAE';
    pendingIntent?: string; // To remember what they asked before we interrupted for location
}

export class SessionManager {
    private sessions: Map<string, UserSession> = new Map();

    public getSession(userId: string): UserSession {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, {});
        }
        return this.sessions.get(userId)!;
    }

    public setLocation(userId: string, location: 'India' | 'UAE') {
        const session = this.getSession(userId);
        session.location = location;
        this.sessions.set(userId, session);
    }

    public clear(userId: string) {
        this.sessions.delete(userId);
    }
}
