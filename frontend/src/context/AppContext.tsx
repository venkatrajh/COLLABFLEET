import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  LocationHub, 
  MatchResult, 
  SearchQueryParams, 
  Shipment, 
  Truck, 
  UserProfile, 
  UserRole 
} from '../types';
import { INDIAN_LOCATION_HUBS, INITIAL_SHIPMENTS } from '../services/mockData';
import { MatchingService } from '../services/matchingService';
import { ShipmentService } from '../services/shipmentService';
import { AuthService } from '../services/authService';

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
  loginUser: (emailOrPhone: string, role: UserRole) => Promise<void>;
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

  const loginUser = async (emailOrPhone: string, role: UserRole) => {
    const user = await AuthService.login(emailOrPhone, role);
    setIsAuthenticated(true);
    setCurrentRoleState(role);
    setUserProfile(user);
    // Role-specific landing directly into the application
    if (role === 'fleet_operator') {
      setActiveView('find_freight');
    } else {
      setActiveView('home');
    }
    showToast(`Welcome ${user.name}! Signed in as ${role === 'shipper' ? 'Shipper' : 'Fleet Owner'}`, 'success');
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
