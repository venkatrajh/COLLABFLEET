import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  LocationHub, 
  MatchResult, 
  SearchQueryParams, 
  Shipment, 
  Truck, 
  UserProfile, 
  UserRole,
  UserSettings
} from '../types';
import { INDIAN_LOCATION_HUBS, INITIAL_SHIPMENTS, INITIAL_USER_PROFILE } from '../services/mockData';
import { MatchingService } from '../services/matchingService';
import { ShipmentService } from '../services/shipmentService';
import { AuthService } from '../services/authService';
import { LocationService } from '../services/locationService';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Authentication & Role
  isAuthenticated: boolean;
  loginUser: (emailOrPhone: string, role?: UserRole) => Promise<void>;
  signUpUser: (fullName: string, email: string, password?: string) => Promise<void>;
  signInWithGoogle: () => Promise<boolean>; // returns true if new account needing role selection
  logoutUser: () => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  
  // Search & Matching
  searchQuery: SearchQueryParams;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQueryParams>>;
  matchingResults: MatchResult[];
  selectedMatch: MatchResult | null;
  setSelectedMatch: (match: MatchResult | null) => void;
  isAiLoading: boolean;
  aiLoadingMessage: string;
  startFreightSearch: (overrideQuery?: SearchQueryParams) => Promise<void>;

  // Panel Collapsing & Expandable Map
  isSearchPanelCollapsed: boolean;
  setIsSearchPanelCollapsed: (collapsed: boolean) => void;
  isMapExpanded: boolean;
  setIsMapExpanded: (expanded: boolean) => void;
  toggleMapExpanded: () => void;

  // Map Controls
  mapCenterTrigger: { coords: [number, number]; zoom?: number; id: number } | null;
  recenterMap: (coords?: [number, number], zoom?: number) => void;

  // Modals & Panels
  isWhyThisTruckOpen: boolean;
  setIsWhyThisTruckOpen: (open: boolean) => void;
  isTruckDetailOpen: boolean;
  setIsTruckDetailOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isBookingSuccessOpen: boolean;
  setIsBookingSuccessOpen: (open: boolean) => void;
  isAddTruckOpen: boolean;
  setIsAddTruckOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Active Entities
  activeBookingShipment: Shipment | null;
  activeTrackingShipment: Shipment | null;
  activeTruckForDetail: Truck | null;
  setActiveTruckForDetail: (truck: Truck | null) => void;
  userProfile: UserProfile;
  refreshUserProfile: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updateUserSettings: (data: Partial<UserSettings>) => void;

  // Real User Location Services
  userLocation: [number, number] | null;
  locationPermissionState: 'granted' | 'denied' | 'prompt' | 'unsupported';
  requestUserLocation: () => Promise<[number, number] | null>;
  recenterOnUserLocation: () => void;

  // Actions
  handleBookTruck: (match: MatchResult) => void;
  handleConfirmBooking: () => Promise<Shipment>;
  handleTrackShipment: (shipment?: Shipment) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toast: ToastData | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state (Mock-ready and FastAPI-ready)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('collabfleet_role') as UserRole;
      if (savedRole === 'shipper' || savedRole === 'fleet_operator') return savedRole;
    } catch {}
    return 'shipper';
  });

  // Initial view: if not authenticated, start at 'landing'. If authenticated, start at 'home'.
  const [activeView, setActiveView] = useState<AppView>(() => {
    return AuthService.isAuthenticated() ? 'home' : 'landing';
  });

  // Fixed Two-Phase Theme System:
  // 1. Landing & Login: DARK MODE ONLY (#000000, #080808, #111111, #FFFFFF, #B5B5B5)
  // 2. Logged-in Application: WARM LIGHT MODE ONLY (#F4F3EF, #FFFFFF, #111111, #DEDDD8)
  const isDarkPhase = !isAuthenticated || activeView === 'landing' || activeView === 'login';
  const theme = isDarkPhase ? 'dark' : 'light';

  useEffect(() => {
    if (isDarkPhase) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkPhase]);

  const toggleTheme = () => {
    // Theme is fixed per phase as designed (no manual toggle)
  };

  const [isSearchPanelCollapsed, setIsSearchPanelCollapsed] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const toggleMapExpanded = () => {
    setIsMapExpanded(prev => !prev);
  };

  // Map center trigger for floating controls & card sync
  const [mapCenterTrigger, setMapCenterTrigger] = useState<{ coords: [number, number]; zoom?: number; id: number } | null>(null);

  const recenterMap = (coords?: [number, number], zoom?: number) => {
    const targetCoords = coords || (searchQuery.fromLocation ? searchQuery.fromLocation.coordinates : [13.0827, 80.2707]);
    setMapCenterTrigger({ coords: targetCoords, zoom: zoom || 7, id: Date.now() });
  };

  // Search defaults: Chennai to Bengaluru, Electronics, 8 tons
  const [searchQuery, setSearchQuery] = useState<SearchQueryParams>({
    fromLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    toLocation: INDIAN_LOCATION_HUBS[4],   // Bengaluru
    cargoType: 'Industrial Electronics',
    weightTons: 8,
    truckType: 'Heavy Truck'
  });

  const [matchingResults, setMatchingResults] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  
  // AI Loading rotating messages
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState('Finding nearby trucks...');

  // Modal states
  const [isWhyThisTruckOpen, setIsWhyThisTruckOpen] = useState(false);
  const [isTruckDetailOpen, setIsTruckDetailOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingSuccessOpen, setIsBookingSuccessOpen] = useState(false);
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Entities
  const [activeBookingShipment, setActiveBookingShipment] = useState<Shipment | null>(null);
  const [activeTrackingShipment, setActiveTrackingShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]);
  const [activeTruckForDetail, setActiveTruckForDetail] = useState<Truck | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(AuthService.getCurrentUser());

  // Toast
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4000);
  };

  const refreshUserProfile = () => {
    setUserProfile(AuthService.getCurrentUser());
  };

  // User Location State (Actual Browser Geolocation)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(() => {
    try {
      const saved = localStorage.getItem('collabfleet_user_coords');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [locationPermissionState, setLocationPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');

  // Initial Location Check on App Mount:
  // If permission is already granted, get coordinates and center map on user first!
  useEffect(() => {
    LocationService.checkPermissionStatus().then(status => {
      setLocationPermissionState(status);
      if (status === 'granted') {
        LocationService.getCurrentLocation().then(coords => {
          if (coords) {
            const loc: [number, number] = [coords.latitude, coords.longitude];
            setUserLocation(loc);
            setMapCenterTrigger({ coords: loc, zoom: 12, id: Date.now() });
          }
        });
      }
    });
  }, []);

  const requestUserLocation = async (): Promise<[number, number] | null> => {
    try {
      const coords = await LocationService.requestLocationPermission();
      const loc: [number, number] = [coords.latitude, coords.longitude];
      setUserLocation(loc);
      setLocationPermissionState('granted');
      setMapCenterTrigger({ coords: loc, zoom: 13, id: Date.now() });
      showToast('Centered on your GPS location', 'success');
      return loc;
    } catch (err: any) {
      if (err?.code === 1) { // PERMISSION_DENIED
        setLocationPermissionState('denied');
        showToast('Location permission denied. Map centered on default corridor.', 'info');
      } else {
        showToast('Location access is off. Enable it in Settings to center around you.', 'info');
      }
      return null;
    }
  };

  const recenterOnUserLocation = () => {
    if (userLocation) {
      setMapCenterTrigger({ coords: userLocation, zoom: 13, id: Date.now() });
      showToast('Centered on your location', 'info');
    } else {
      requestUserLocation();
    }
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    const updated = AuthService.updateProfile(data);
    setUserProfile({ ...updated });
    showToast('Profile updated successfully', 'success');
  };

  const updateUserSettings = (data: Partial<UserSettings>) => {
    const currentSettings = userProfile.settings || INITIAL_USER_PROFILE.settings!;
    const updatedSettings: UserSettings = {
      notifications: { ...currentSettings.notifications, ...(data.notifications || {}) },
      privacy: { ...currentSettings.privacy, ...(data.privacy || {}) },
      location: { ...currentSettings.location, ...(data.location || {}) },
    };
    const updated = AuthService.updateProfile({ settings: updatedSettings });
    setUserProfile({ ...updated });
    showToast('Settings saved', 'success');
  };

  const loginUser = async (emailOrPhone: string, role?: UserRole) => {
    const chosenRole = role || currentRole;
    const user = await AuthService.signIn(emailOrPhone, 'demo-password', chosenRole);
    setIsAuthenticated(true);
    setCurrentRoleState(chosenRole);
    setUserProfile(user);
    if (chosenRole === 'fleet_operator') {
      setActiveView('find_freight');
    } else {
      setActiveView('home');
    }
    showToast(`Welcome back, ${user.name}! Signed in as ${chosenRole === 'shipper' ? 'Shipper' : 'Fleet Owner'}`, 'success');
  };

  const signUpUser = async (fullName: string, email: string, password?: string) => {
    const user = await AuthService.signUp(fullName, email, password);
    setIsAuthenticated(true);
    setUserProfile(user);
    showToast('Account created successfully!', 'success');
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    const result = await AuthService.signInWithGoogle();
    setIsAuthenticated(true);
    setUserProfile(result.user);
    showToast(`Signed in with Google as ${result.user.name}`, 'success');
    return result.isNewAccount;
  };

  const logoutUser = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setActiveView('landing');
    showToast('Signed out successfully', 'info');
  };

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    AuthService.setRole(role);
    refreshUserProfile();
    showToast(`Switched to ${role === 'shipper' ? 'Shipper' : 'Fleet Owner'} Mode`, 'info');
    if (role === 'fleet_operator' && (activeView === 'find_truck' || activeView === 'home')) {
      setActiveView('find_freight');
    } else if (role === 'shipper' && activeView === 'find_freight') {
      setActiveView('home');
    }
  };

  // AI Matching Flow with rotating intelligence messages
  const startFreightSearch = async (overrideQuery?: SearchQueryParams) => {
    const queryToUse = overrideQuery || searchQuery;
    setIsAiLoading(true);

    const steps = [
      'Finding nearby trucks...',
      'Checking available space...',
      'Comparing routes...',
      'Looking for return-trip opportunities...',
      'Calculating best matches...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAiLoadingMessage(steps[i]);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      const results = await MatchingService.findMatchingTrucks(queryToUse);
      setMatchingResults(results);
      if (results.length > 0) {
        setSelectedMatch(results[0]);
      }
      setIsAiLoading(false);
      setActiveView('matching_results');
      showToast(`Found ${results.length} available trucks on this corridor`, 'success');
    } catch (err) {
      setIsAiLoading(false);
      showToast('Error calculating matches. Please try again.', 'error');
    }
  };

  const handleBookTruck = (match: MatchResult) => {
    setSelectedMatch(match);
    setIsTruckDetailOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (): Promise<Shipment> => {
    const newShipment = await ShipmentService.createBooking({
      fromLocation: searchQuery.fromLocation || undefined,
      toLocation: searchQuery.toLocation || undefined,
      cargoType: searchQuery.cargoType,
      weightTons: searchQuery.weightTons,
      truckTypeNeeded: searchQuery.truckType,
      truck: selectedMatch?.truck,
      price: selectedMatch?.estimatedPrice || 8400,
      matchScore: selectedMatch?.matchScore || 94,
      collaborationScore: selectedMatch?.collaborationScore || 92,
      isReturnTrip: selectedMatch?.isReturnTrip,
      emptyKmSaved: selectedMatch?.emptyKmSaved,
      savingsAmount: selectedMatch?.savingsAmount,
      co2ReductionKg: selectedMatch?.co2ReductionKg
    });

    setActiveBookingShipment(newShipment);
    setActiveTrackingShipment(newShipment);
    setIsBookingModalOpen(false);
    setIsBookingSuccessOpen(true);
    showToast(`Booking ${newShipment.trackingNumber} confirmed!`, 'success');
    return newShipment;
  };

  const handleTrackShipment = (shipment?: Shipment) => {
    const target = shipment || activeBookingShipment || INITIAL_SHIPMENTS[0];
    setActiveTrackingShipment(target);
    setIsBookingSuccessOpen(false);
    setIsTruckDetailOpen(false);
    setIsWhyThisTruckOpen(false);
    setActiveView('track_shipment');
    showToast(`Tracking live telemetry for ${target.trackingNumber}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        loginUser,
        signUpUser,
        signInWithGoogle,
        logoutUser,
        currentRole,
        setRole,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        matchingResults,
        selectedMatch,
        setSelectedMatch,
        isAiLoading,
        aiLoadingMessage,
        startFreightSearch,
        isSearchPanelCollapsed,
        setIsSearchPanelCollapsed,
        isMapExpanded,
        setIsMapExpanded,
        toggleMapExpanded,
        mapCenterTrigger,
        recenterMap,
        isWhyThisTruckOpen,
        setIsWhyThisTruckOpen,
        isTruckDetailOpen,
        setIsTruckDetailOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isBookingSuccessOpen,
        setIsBookingSuccessOpen,
        isAddTruckOpen,
        setIsAddTruckOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeBookingShipment,
        activeTrackingShipment,
        activeTruckForDetail,
        setActiveTruckForDetail,
        userProfile,
        refreshUserProfile,
        updateUserProfile,
        updateUserSettings,
        userLocation,
        locationPermissionState,
        requestUserLocation,
        recenterOnUserLocation,
        handleBookTruck,
        handleConfirmBooking,
        handleTrackShipment,
        showToast,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
