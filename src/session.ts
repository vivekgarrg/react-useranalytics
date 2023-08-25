class SessionManager {
    private sessionKey: string;

    constructor(sessionKey: string) {
        this.sessionKey = sessionKey;
    }

    public startSession(): void {
        const sessionData = {
            startTime: new Date().toISOString(),
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    public endSession(): number | undefined {
        const sessionDataStr = localStorage.getItem(this.sessionKey);
        if (sessionDataStr) {
            const sessionData = JSON.parse(sessionDataStr);
            const endTime = new Date().toISOString();
            sessionData.endTime = endTime;
            sessionData.duration = this.calculateSessionDuration(
                sessionData.startTime,
                endTime,
            );
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            return sessionData.duration;
        }
    }

    public calculateSessionDuration(startTime: string, endTime: string): number {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return (end.getTime() - start.getTime()) / 1000; // Session duration in seconds
    }
}

const userSession = new SessionManager("user_session");

export default userSession;
