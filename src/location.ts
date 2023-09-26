class LocationManager {
    public longitude: number | null = null;
    public latitude: number | null = null;

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.handleSuccess(position);
                },
                (error) => {
                    this.handleError(error);
                },
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
        return undefined;
    }

    private handleSuccess(position: GeolocationPosition) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    private handleError(error: GeolocationPositionError) {
        console.error("Error getting location:", error);
    }
}

const locationManager = new LocationManager();

export default locationManager;
