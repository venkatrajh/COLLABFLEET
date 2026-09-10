export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export class LocationService {
  private static watchId: number | null = null;
  private static cachedLocation: GeoCoordinates | null = null;

  /**
   * Check browser permission status for geolocation
   */
  public static async checkPermissionStatus(): Promise<PermissionState> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return 'unsupported';
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state as PermissionState;
      }
    } catch {
      // Permission API not supported for geolocation in some browsers
    }

    return 'prompt';
  }

  /**
   * Request actual browser GPS location via navigator.geolocation
   * Does NOT fake or hardcode coordinates.
   */
  public static requestLocationPermission(): Promise<GeoCoordinates> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeoCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.cachedLocation = coords;
          try {
            localStorage.setItem('collabfleet_user_coords', JSON.stringify([coords.latitude, coords.longitude]));
            localStorage.setItem('collabfleet_location_permission', 'granted');
          } catch {}
          resolve(coords);
        },
        (error) => {
          try {
            if (error.code === error.PERMISSION_DENIED) {
              localStorage.setItem('collabfleet_location_permission', 'denied');
            }
          } catch {}
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    });
  }

  /**
   * Get cached or freshly requested GPS location
   */
  public static async getCurrentLocation(): Promise<GeoCoordinates | null> {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    try {
      const saved = localStorage.getItem('collabfleet_user_coords');
      if (saved) {
        const [lat, lng] = JSON.parse(saved);
        this.cachedLocation = { latitude: lat, longitude: lng };
        return this.cachedLocation;
      }
    } catch {}

    try {
      return await this.requestLocationPermission();
    } catch {
      return null;
    }
  }

  /**
   * Watch live location changes (if enabled)
   */
  public static watchLocation(onLocation: (coords: GeoCoordinates) => void, onError?: (err: GeolocationPositionError) => void): number | null {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return null;
    }

    this.stopWatchingLocation();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: GeoCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        this.cachedLocation = coords;
        onLocation(coords);
      },
      (error) => {
        if (onError) onError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );

    return this.watchId;
  }

  /**
   * Stop watching location
   */
  public static stopWatchingLocation(): void {
    if (this.watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Check if user had previously granted location permission
   */
  public static hasStoredPermission(): boolean {
    try {
      return localStorage.getItem('collabfleet_location_permission') === 'granted';
    } catch {
      return false;
    }
  }
}
