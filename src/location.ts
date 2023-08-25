class LocationManager {
    getUserLocation(): Array<string> | undefined {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    return this.handleSuccess(position);
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
        return [latitude, longitude];
    }

    private handleError(error: GeolocationPositionError) {
        console.error("Error getting location:", error);
    }
}

const locationManager = new LocationManager();

export default locationManager;
