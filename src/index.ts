import locationManager from "./location";
import userSession from "./session";

interface propertiesOfAnalytics {
    page: string;
    title: string;
    subTitle?: string;
}

class UserAnalytics {
    private _pageDuration: { [key: string]: number } = {};
    private _pageStartTime: { [key: string]: string } = {};
    private _pageTitle: { [key: string]: string } = {};
    private _pageSubtitle: { [key: string]: string } = {};
    private _currentPage: string | undefined = undefined;
    private _userIdValue: string | undefined = undefined;

    public apiKey: string | null = null;
    public apiCallTime: number = 30; //Minutes

    constructor() {
        userSession.startSession();
        locationManager.getUserLocation();
        window.addEventListener("beforeunload", this.handleUnload);
        if (typeof document.hidden !== "undefined") {
            document.addEventListener("visibilitychange", this.handleVisibilityChange);
        } else {
            console.error("Page Visibility API is not supported in this browser.");
        }

        const apiCallInterval = this.apiCallTime * 60000; // 1 minute in milliseconds
        setInterval(() => {
            this.handleUnload();
            this.resetTime();
            userSession.startSession();
        }, apiCallInterval);
    }

    public setUserId(value: string) {
        this._userIdValue = value;
    }

    public set(properties: propertiesOfAnalytics) {
        const { page, title, subTitle } = properties;
        const startTime = new Date().toISOString();
        this._currentPage = page;
        this._pageStartTime[page] = startTime;
        this._pageTitle[page] = title;
        if (subTitle) this._pageSubtitle[page] = subTitle;
    }

    public logTime() {
        if (this._currentPage) this.calculateLogTime(this._currentPage);
    }
    private handleUnload = () => {
        if (this._currentPage) this.calculateLogTime(this._currentPage);
        if (this.apiKey && Object.keys(this._pageDuration).length > 0) {
            try {
                fetch(this.apiKey, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pages: Object.keys(this._pageDuration).map((key) => {
                            return {
                                page: key,
                                duration: this._pageDuration[key],
                                title: this._pageTitle[key],
                                subTitle: this._pageSubtitle[key],
                            };
                        }),
                        session: {
                            startTime: JSON.parse(
                                sessionStorage.getItem("user_session") as string,
                            )?.startTime,
                            endTime: new Date().toISOString(),
                            duration: userSession.endSession(),
                            latitude: locationManager?.latitude ?? null,
                            longitude: locationManager?.longitude ?? null,
                            user: this._userIdValue,
                        },
                    }),
                });
            } catch (error) {
                console.error("Error sending POST request:", error);
            }
        } else {
            console.error("no api url is available");
        }
    };

    private calculateLogTime(pageTitle: string) {
        const endTime = new Date().toISOString();
        const timeOnPage = userSession.calculateSessionDuration(
            this._pageStartTime[pageTitle],
            endTime,
        );
        this._pageDuration[pageTitle] = (this._pageDuration[pageTitle] || 0) + timeOnPage;
    }

    private handleVisibilityChange = () => {
        if (document.hidden) {
            const page = this._currentPage;
            const title = this._pageTitle[page as string];
            const subTitle = this._pageSubtitle[page as string];
            const userId = this._userIdValue;
            this.handleUnload();
            this.resetTime();
            this.set({
                page: page as string,
                title,
                subTitle,
            });
            this.setUserId(userId as string);
        } else if (this._userIdValue && this._currentPage) {
            this.set({
                page: this._currentPage,
                title: this._pageTitle[this._currentPage],
                subTitle: this._pageSubtitle[this._currentPage],
            });
        } else {
            userSession.startSession();
        }
    };

    private resetTime(): void {
        this._pageDuration = {};
        this._pageStartTime = {};
        this._pageTitle = {};
        this._pageSubtitle = {};
        this._currentPage = undefined;
    }
}

// Instantiate the class
const userAnalytics = new UserAnalytics();

// Export the instance if needed
export default userAnalytics;
