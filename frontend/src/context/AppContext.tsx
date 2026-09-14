import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppNotification,
  AppView, 
  BookingMessage,
  LocationHub, 
  MatchResult, 
  NotificationPreferences,
  NotificationType,
  SearchQueryParams, 
  Shipment, 
  Truck, 
  TruckType,
  UserProfile, 
  UserRole,
  UserSettings
} from '../types';
import { INDIAN_LOCATION_HUBS, INITIAL_SHIPMENTS, INITIAL_USER_PROFILE } from '../services/mockData';
import { MatchingService } from '../services/matchingService';
import { ShipmentService } from '../services/shipmentService';
import { AuthService } from '../services/authService';
import { LocationService } from '../services/locationService';
import { NotificationService } from '../services/notificationService';

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

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  toggleNotificationsOpen: () => void;
  hasNewNotification: boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  triggerNotification: (
    type: NotificationType, 
    title: string, 
    message: string, 
    relatedId?: string, 
    relatedView?: AppView,
    role?: UserRole
  ) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Actions
  handleBookTruck: (match: MatchResult) => void;
  handleConfirmBooking: () => Promise<Shipment>;
  handleTrackShipment: (shipment?: Shipment) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toast: ToastData | null;

  // Booking Workflow & Communication Actions
  activeChatShipment: Shipment | null;
  isChatModalOpen: boolean;
  openChatForShipment: (shipment: Shipment) => void;
  closeChatModal: () => void;
  activeCallShipment: Shipment | null;
  isCallModalOpen: boolean;
  openCallForShipment: (shipment: Shipment) => void;
  closeCallModal: () => void;
  handleAcceptBooking: (shipmentId: string) => Promise<void>;
  handleDeclineBooking: (shipmentId: string) => Promise<void>;
  handleStartTrip: (shipmentId: string) => Promise<void>;
  handleCompleteTrip: (shipmentId: string) => Promise<void>;
  handleSendMessage: (shipmentId: string, text: string) => Promise<BookingMessage | null>;
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

  // Geographic boundary check for India
  const isInsideIndia = (coords?: [number, number] | null): boolean => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
    const [lat, lng] = coords;
    return lat >= 6.0 && lat <= 38.0 && lng >= 67.5 && lng <= 98.0;
  };

  // Map center trigger for floating controls & card sync (Guarded to India)
  const [mapCenterTrigger, setMapCenterTrigger] = useState<{ coords: [number, number]; zoom?: number; id: number } | null>(null);

  const recenterMap = (coords?: [number, number], zoom?: number) => {
    let targetCoords = coords;
    if (!targetCoords || !isInsideIndia(targetCoords)) {
      targetCoords = searchQuery.fromLocation && isInsideIndia(searchQuery.fromLocation.coordinates)
        ? searchQuery.fromLocation.coordinates
        : [21.5, 78.96];
    }
    setMapCenterTrigger({ coords: targetCoords, zoom: zoom || 6, id: Date.now() });
  };

  // Search defaults: Chennai to Bengaluru, Electronics, 8 tons
  const [searchQuery, setSearchQuery] = useState<SearchQueryParams>({
    fromLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    toLocation: INDIAN_LOCATION_HUBS[4],   // Bengaluru
    cargoType: 'Industrial Electronics',
    weightTons: 8,
    truckType: 'Any'
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

  // Chat & Call modal states
  const [activeChatShipment, setActiveChatShipment] = useState<Shipment | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeCallShipment, setActiveCallShipment] = useState<Shipment | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const openChatForShipment = (shipment: Shipment) => {
    if (isChatModalOpen && (activeChatShipment?.id === shipment.id || activeChatShipment?.trackingNumber === shipment.trackingNumber)) {
      closeChatModal();
      return;
    }
    const readUpdated = ShipmentService.markMessagesAsRead(shipment.id, currentRole) || shipment;
    setActiveChatShipment(readUpdated);
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setActiveChatShipment(null);
  };

  const openCallForShipment = (shipment: Shipment) => {
    setActiveCallShipment(shipment);
    setIsCallModalOpen(true);
  };

  const closeCallModal = () => {
    setIsCallModalOpen(false);
    setActiveCallShipment(null);
  };

  // Entities
  const [activeBookingShipment, setActiveBookingShipment] = useState<Shipment | null>(null);
  const [activeTrackingShipment, setActiveTrackingShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]);
  const [activeTruckForDetail, setActiveTruckForDetail] = useState<Truck | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(AuthService.getCurrentUser());

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return NotificationService.getNotifications(userProfile?.email || 'demo@collabfleet.ai', currentRole);
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Sync notifications when user or role changes
  useEffect(() => {
    if (userProfile?.email) {
      const list = NotificationService.getNotifications(userProfile.email, currentRole);
      setNotifications(list);
    }
  }, [userProfile?.email, currentRole]);

  const toggleNotificationsOpen = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen) {
      setHasNewNotification(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    const updated = NotificationService.markAsRead(userProfile.email, id);
    setNotifications(updated.filter(n => !n.role || n.role === currentRole));
  };

  const markAllNotificationsAsRead = () => {
    const updated = NotificationService.markAllAsRead(userProfile.email, currentRole);
    setNotifications(updated.filter(n => !n.role || n.role === currentRole));
    showToast('All notifications marked as read', 'info');
  };

  const removeNotification = (id: string) => {
    const updated = NotificationService.removeNotification(userProfile.email, id);
    setNotifications(updated.filter(n => !n.role || n.role === currentRole));
  };

  const clearAllNotifications = () => {
    NotificationService.clearNotifications(userProfile.email, currentRole);
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  const triggerNotification = (
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    relatedView?: AppView,
    role?: UserRole
  ) => {
    const targetRole = role || currentRole;
    const added = NotificationService.addNotification(userProfile.email, targetRole, {
      type,
      title,
      message,
      relatedId,
      relatedView,
      role: targetRole
    });

    if (added) {
      setNotifications(prev => [added, ...prev.filter(n => n.id !== added.id)]);
      setHasNewNotification(true);
      setTimeout(() => setHasNewNotification(false), 3500);
    }
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    const updated = NotificationService.updatePreferences(userProfile.email, prefs);
    updateUserSettings({ notifications: updated });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
  // If permission is already granted, get coordinates and center map on user if inside India!
  useEffect(() => {
    LocationService.checkPermissionStatus().then(status => {
      setLocationPermissionState(status);
      if (status === 'granted') {
        LocationService.getCurrentLocation().then(coords => {
          if (coords) {
            const loc: [number, number] = [coords.latitude, coords.longitude];
            if (isInsideIndia(loc)) {
              setUserLocation(loc);
              setMapCenterTrigger({ coords: loc, zoom: 12, id: Date.now() });
            }
          }
        });
      }
    });
  }, []);

  const requestUserLocation = async (): Promise<[number, number] | null> => {
    try {
      const coords = await LocationService.requestLocationPermission();
      const loc: [number, number] = [coords.latitude, coords.longitude];
      if (isInsideIndia(loc)) {
        setUserLocation(loc);
        setLocationPermissionState('granted');
        setMapCenterTrigger({ coords: loc, zoom: 13, id: Date.now() });
        showToast('Centered on your GPS location in India', 'success');
        return loc;
      } else {
        setLocationPermissionState('granted');
        showToast('Your GPS location is outside India. Map remains focused on India freight network.', 'info');
        recenterMap([21.5, 78.96], 5);
        return null;
      }
    } catch (err: any) {
      if (err?.code === 1) { // PERMISSION_DENIED
        setLocationPermissionState('denied');
        showToast('Location permission denied. Map centered on India freight network.', 'info');
      } else {
        showToast('Location access is off. Enable it in Settings to center around you.', 'info');
      }
      return null;
    }
  };

  const recenterOnUserLocation = () => {
    if (userLocation && isInsideIndia(userLocation)) {
      setMapCenterTrigger({ coords: userLocation, zoom: 13, id: Date.now() });
      showToast('Centered on your location in India', 'info');
    } else {
      requestUserLocation();
    }
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    const updated = AuthService.updateProfile(data);
    setUserProfile({ ...updated });
    if (data.name || data.company || data.email || data.phone) {
      showToast('Profile updated successfully', 'success');
      triggerNotification(
        'ACCOUNT',
        'Profile Updated',
        'Your profile information has been successfully updated.',
        undefined,
        'profile'
      );
    }
  };

  const updateUserSettings = (data: Partial<UserSettings>) => {
    const currentSettings = userProfile.settings || INITIAL_USER_PROFILE.settings!;
    const updatedSettings: UserSettings = {
      notifications: { ...currentSettings.notifications, ...(data.notifications || {}) },
      privacy: { ...currentSettings.privacy, ...(data.privacy || {}) },
      location: { ...currentSettings.location, ...(data.location || {}) },
    };
    if (data.notifications) {
      NotificationService.updatePreferences(userProfile.email, data.notifications);
    }
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
        triggerNotification(
          'MATCH',
          'Truck Match Found',
          `A highly compatible truck is available for your ${queryToUse.fromLocation?.name || 'Chennai'} → ${queryToUse.toLocation?.name || 'Bengaluru'} shipment.`,
          results[0]?.truck?.id,
          'matching_results'
        );
        const returnMatch = results.find(r => r.isReturnTrip);
        if (returnMatch) {
          triggerNotification(
            'RETURN_TRIP',
            'Return Trip Opportunity',
            `A return-trip match could save ₹${(returnMatch.savingsAmount || 1850).toLocaleString('en-IN')} on this corridor.`,
            returnMatch.truck.id,
            'matching_results'
          );
        }
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
      truckTypeNeeded: (searchQuery.truckType && searchQuery.truckType !== 'Any') 
        ? (searchQuery.truckType as TruckType) 
        : (selectedMatch?.truck.truckType || 'Heavy Truck'),
      truck: selectedMatch?.truck,
      price: selectedMatch?.estimatedPrice || 8400,
      matchScore: selectedMatch?.matchScore || 94,
      collaborationScore: selectedMatch?.collaborationScore || 92,
      isReturnTrip: selectedMatch?.isReturnTrip,
      emptyKmSaved: selectedMatch?.emptyKmSaved,
      savingsAmount: selectedMatch?.savingsAmount,
      co2ReductionKg: selectedMatch?.co2ReductionKg,
      status: 'pending',
      shipperName: userProfile.name,
      shipperCompany: userProfile.company
    });

    // Dynamically update user impact metrics and save profile
    const currentStats = userProfile.stats;
    const updatedStats = {
      ...currentStats,
      emptyKmSaved: currentStats.emptyKmSaved + (newShipment.emptyKmSaved || 45),
      moneySaved: currentStats.moneySaved + (newShipment.savingsAmount || 1200),
      co2ReductionKg: currentStats.co2ReductionKg + (newShipment.co2ReductionKg || 90),
      activeShipments: currentStats.activeShipments + 1
    };
    updateUserProfile({ stats: updatedStats });

    setActiveBookingShipment(newShipment);
    setIsBookingModalOpen(false);
    setIsBookingSuccessOpen(true);
    showToast(`Booking request sent for ${newShipment.trackingNumber}! Waiting for fleet owner confirmation.`, 'info');

    // Notify Shipper
    triggerNotification(
      'BOOKING',
      'Booking Request Sent',
      `Your request for ${newShipment.truck?.name || 'Truck'} has been sent (${newShipment.fromLocation.name} → ${newShipment.toLocation.name}). Waiting for fleet owner confirmation.`,
      newShipment.trackingNumber,
      'my_shipments',
      'shipper'
    );

    // Notify Fleet Owner
    triggerNotification(
      'BOOKING',
      'New Shipment Request',
      `${userProfile.name} requested ${newShipment.truck?.name || 'your truck'} for ${newShipment.cargoType} (${newShipment.weightTons}T) from ${newShipment.fromLocation.name} → ${newShipment.toLocation.name}.`,
      newShipment.trackingNumber,
      'find_freight',
      'fleet_operator'
    );

    return newShipment;
  };

  const handleAcceptBooking = async (shipmentId: string) => {
    const updated = ShipmentService.acceptBooking(shipmentId);
    if (updated) {
      if (activeBookingShipment?.id === shipmentId || activeBookingShipment?.trackingNumber === shipmentId) {
        setActiveBookingShipment(updated);
      }
      if (activeChatShipment?.id === shipmentId || activeChatShipment?.trackingNumber === shipmentId) {
        setActiveChatShipment(updated);
      }
      showToast(`Booking ${updated.trackingNumber} accepted! Communication enabled.`, 'success');

      // Notify Shipper
      triggerNotification(
        'BOOKING',
        'Booking Confirmed',
        `${updated.truck?.name || 'Fleet Partner'} has accepted your shipment request for ${updated.cargoType}. Communication is now enabled.`,
        updated.trackingNumber,
        'my_shipments',
        'shipper'
      );

      // Notify Fleet Owner
      triggerNotification(
        'BOOKING',
        'Booking Accepted',
        `You accepted shipment ${updated.trackingNumber}. You can now message, call, or start the trip.`,
        updated.trackingNumber,
        'my_shipments',
        'fleet_operator'
      );
    }
  };

  const handleDeclineBooking = async (shipmentId: string) => {
    const updated = ShipmentService.declineBooking(shipmentId);
    if (updated) {
      if (activeBookingShipment?.id === shipmentId || activeBookingShipment?.trackingNumber === shipmentId) {
        setActiveBookingShipment(updated);
      }
      showToast(`Booking request ${updated.trackingNumber} declined.`, 'info');

      // Notify Shipper
      triggerNotification(
        'BOOKING',
        'Request Declined',
        `Your booking request for ${updated.truck?.name || 'Truck'} was declined by the carrier. You can search for another truck.`,
        updated.trackingNumber,
        'find_truck',
        'shipper'
      );

      // Notify Fleet Owner
      triggerNotification(
        'BOOKING',
        'Request Declined',
        `You declined booking request ${updated.trackingNumber}.`,
        updated.trackingNumber,
        'find_freight',
        'fleet_operator'
      );
    }
  };

  const handleStartTrip = async (shipmentId: string) => {
    const updated = ShipmentService.startTrip(shipmentId);
    if (updated) {
      setActiveTrackingShipment(updated);
      if (activeBookingShipment?.id === shipmentId || activeBookingShipment?.trackingNumber === shipmentId) {
        setActiveBookingShipment(updated);
      }
      if (activeChatShipment?.id === shipmentId || activeChatShipment?.trackingNumber === shipmentId) {
        setActiveChatShipment(updated);
      }
      showToast(`Trip started for ${updated.trackingNumber}! Live telemetry active.`, 'success');

      // Notify Shipper
      triggerNotification(
        'TRACKING',
        'Trip Started',
        `${updated.truck?.name || 'Driver'} has commenced the trip from ${updated.fromLocation.name} to ${updated.toLocation.name}. Live tracking active.`,
        updated.trackingNumber,
        'track_shipment',
        'shipper'
      );

      // Notify Fleet Owner
      triggerNotification(
        'TRACKING',
        'Trip In Progress',
        `Trip ${updated.trackingNumber} is now in progress. Tracking connected.`,
        updated.trackingNumber,
        'track_shipment',
        'fleet_operator'
      );
    }
  };

  const handleCompleteTrip = async (shipmentId: string) => {
    const updated = ShipmentService.completeTrip(shipmentId);
    if (updated) {
      if (activeTrackingShipment?.id === shipmentId || activeTrackingShipment?.trackingNumber === shipmentId) {
        setActiveTrackingShipment(updated);
      }
      if (activeBookingShipment?.id === shipmentId || activeBookingShipment?.trackingNumber === shipmentId) {
        setActiveBookingShipment(updated);
      }
      if (activeChatShipment?.id === shipmentId || activeChatShipment?.trackingNumber === shipmentId) {
        setActiveChatShipment(updated);
      }
      showToast(`Trip ${updated.trackingNumber} completed successfully!`, 'success');

      // Notify Shipper
      triggerNotification(
        'DELIVERY',
        'Shipment Delivered',
        `Your shipment ${updated.trackingNumber} has been safely delivered to ${updated.toLocation.name}.`,
        updated.trackingNumber,
        'my_shipments',
        'shipper'
      );

      // Notify Fleet Owner
      triggerNotification(
        'DELIVERY',
        'Trip Completed',
        `Delivery confirmed for ${updated.trackingNumber}. Payout credited to account.`,
        updated.trackingNumber,
        'my_shipments',
        'fleet_operator'
      );
    }
  };

  const handleSendMessage = async (shipmentId: string, text: string): Promise<BookingMessage | null> => {
    if (!text.trim()) return null;
    const senderName = currentRole === 'shipper' 
      ? userProfile.name 
      : (activeChatShipment?.truck?.driver?.name || userProfile.name || 'Fleet Partner');
    const newMsg = ShipmentService.addBookingMessage(shipmentId, {
      senderRole: currentRole,
      senderName,
      text: text.trim()
    });
    if (newMsg) {
      const refreshed = await ShipmentService.getShipmentByTracking(shipmentId);
      if (refreshed) {
        setActiveChatShipment(refreshed);
      }
    }
    return newMsg;
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
        notifications,
        unreadNotificationsCount,
        isNotificationsOpen,
        setIsNotificationsOpen,
        toggleNotificationsOpen,
        hasNewNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearAllNotifications,
        triggerNotification,
        updateNotificationPreferences,
        handleBookTruck,
        handleConfirmBooking,
        handleTrackShipment,
        activeChatShipment,
        isChatModalOpen,
        openChatForShipment,
        closeChatModal,
        activeCallShipment,
        isCallModalOpen,
        openCallForShipment,
        closeCallModal,
        handleAcceptBooking,
        handleDeclineBooking,
        handleStartTrip,
        handleCompleteTrip,
        handleSendMessage,
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
