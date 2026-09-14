import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { TrackingService } from '../../services/trackingService';
import { ShipmentService } from '../../services/shipmentService';
import { 
  MessageSquare, 
  MessageCircle,
  Share2, 
  ArrowLeft,
  RotateCw,
  Check
} from 'lucide-react';

const STATUS_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'driver_assigned', label: 'Assigned' },
  { key: 'going_to_pickup', label: 'Pickup' },
  { key: 'picked_up', label: 'Loaded' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' }
];

interface ChatMessage {
  id: string;
  sender: 'driver' | 'user';
  text: string;
  time: string;
}

export const TrackingPanel: React.FC = () => {
  const { 
    activeTrackingShipment, 
    setActiveView, 
    showToast,
    recenterMap,
    triggerNotification,
    openChatForShipment,
    currentRole
  } = useApp();

  const shipment = activeTrackingShipment;

  const [progress, setProgress] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm1',
      sender: 'driver',
      text: `Vanakkam Sir! Picked up the freight from ${shipment?.fromLocation?.name || 'the warehouse'}. Cargo is securely strapped.`,
      time: '12m ago'
    },
    {
      id: 'm2',
      sender: 'driver',
      text: `Cruising at 58 km/h along NH48. ETA to ${shipment?.toLocation?.name || 'destination'} is well on schedule.`,
      time: 'Just now'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isDriverTyping, setIsDriverTyping] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          setIsSimulating(false);
          setShowRatingModal(true);
          return 100;
        }
        return prev + 1.2;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  if (!shipment) {
    return (
      <div className="p-4 glass-panel rounded-2xl text-center space-y-2 pointer-events-auto">
        <p className="text-xs text-neutral-500">No active tracking shipment.</p>
        <button
          onClick={() => setActiveView('find_truck')}
          className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-xs"
        >
          Find a Truck
        </button>
      </div>
    );
  }

  const trackingInfo = TrackingService.getInterpolatedPosition(
    progress,
    shipment.truck?.routePolyline
  );

  const notifiedMilestones = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!shipment) return;
    const currentStatus = trackingInfo.status;
    const key = `${shipment.id}-${currentStatus}`;

    if (!notifiedMilestones.current.has(key)) {
      notifiedMilestones.current.add(key);

      if (currentStatus === 'driver_assigned') {
        triggerNotification(
          'TRACKING',
          'Driver Assigned',
          `Driver ${shipment?.truck?.driver?.name || 'Driver Assigned'} assigned to ${shipment?.trackingNumber || 'shipment'}.`,
          shipment.id,
          'track_shipment'
        );
      } else if (currentStatus === 'going_to_pickup') {
        triggerNotification(
          'TRACKING',
          'Going to Pickup',
          `Truck is en route to ${shipment?.fromLocation?.name || 'pickup location'} for pickup.`,
          shipment.id,
          'track_shipment'
        );
      } else if (currentStatus === 'picked_up') {
        triggerNotification(
          'TRACKING',
          'Shipment Picked Up',
          `Your cargo was loaded and is departing ${shipment?.fromLocation?.city || 'origin'}.`,
          shipment.id,
          'track_shipment'
        );
      } else if (currentStatus === 'in_transit') {
        triggerNotification(
          'TRACKING',
          'In Transit',
          `Shipment ${shipment.trackingNumber} is cruising along the corridor.`,
          shipment.id,
          'track_shipment'
        );
      } else if (currentStatus === 'delivered') {
        triggerNotification(
          'DELIVERY',
          'Delivery Completed',
          `Shipment ${shipment.trackingNumber} has been delivered. Rate your experience.`,
          shipment.id,
          'my_shipments'
        );
      }
    }
  }, [trackingInfo.status, shipment?.id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isChatOpen && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isDriverTyping, isChatOpen]);

  const generateDriverResponse = (userText: string): string => {
    const lower = userText.toLowerCase();
    const destName = shipment?.toLocation.name || 'destination';

    if (lower.includes('where') || lower.includes('location') || lower.includes('reach') || lower.includes('kahan') || lower.includes('toll')) {
      return `Currently passing near the main toll plaza on NH48. Road is clear and we are cruising at ${trackingInfo.speedKmph || 58} km/h.`;
    }
    if (lower.includes('time') || lower.includes('eta') || lower.includes('when') || lower.includes('delay') || lower.includes('late')) {
      return `On schedule! Expecting to reach ${destName} in approx ${trackingInfo.etaMinutes || 45} mins. No traffic holdups.`;
    }
    if (lower.includes('pickup') || lower.includes('loaded') || lower.includes('loading') || lower.includes('strap') || lower.includes('cargo') || lower.includes('secure')) {
      return `Cargo was thoroughly inspected and strapped with heavy-duty ties at pickup. Everything is 100% stable.`;
    }
    if (lower.includes('careful') || lower.includes('fragile') || lower.includes('handle') || lower.includes('damage') || lower.includes('safe')) {
      return `Understood Sir! Taking extra caution over bridges and turns. Cargo safety is my top priority.`;
    }
    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('vanakkam') || lower.includes('namaste')) {
      return `Namaste Sir! Everything is moving smoothly along the corridor toward ${destName}. Let me know if you need anything.`;
    }
    if (lower.includes('call') || lower.includes('phone') || lower.includes('number')) {
      return `Cell network is strong along this stretch. Feel free to call directly via the call button anytime.`;
    }
    return `Got it Sir! Cargo is completely safe in transit. I will update you as soon as we approach the unloading bay at ${destName}.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : newMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    showToast('Message sent to driver', 'info');

    // Trigger driver typing simulation
    setIsDriverTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const replyDelay = Math.floor(1600 + Math.random() * 600); // 1.6 - 2.2s
    typingTimeoutRef.current = setTimeout(() => {
      const driverReply: ChatMessage = {
        id: `d-${Date.now()}`,
        sender: 'driver',
        text: generateDriverResponse(text),
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, driverReply]);
      setIsDriverTyping(false);
    }, replyDelay);
  };

  const getStepIndex = (status: ShipmentStatus) => {
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  const currentStepIndex = getStepIndex(trackingInfo.status);

  const handleMessage = () => {
    if (shipment) {
      openChatForShipment(shipment);
    }
  };

  const handleShare = () => {
    showToast(`Tracking link for ${shipment.trackingNumber} copied!`, 'info');
  };

  const handleReset = () => {
    notifiedMilestones.current.clear();
    setProgress(5);
    setIsSimulating(true);
    if (shipment?.fromLocation?.coordinates) {
      recenterMap(shipment.fromLocation.coordinates, 8);
    }
    showToast('Simulation reset to origin', 'info');
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('my_shipments')}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            title="Back to shipments"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-black text-neutral-900 dark:text-white font-mono">
              {shipment?.trackingNumber || 'CF-SHIPMENT'}
            </div>
            <div className="text-[10px] text-neutral-500">
              {shipment?.fromLocation?.name || 'Origin Hub'} → {shipment?.toLocation?.name || 'Destination Hub'}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white"
          title="Replay movement"
          aria-label="Replay"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Status */}
      <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
            Status
          </span>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">
            Your shipment is on the way
          </h3>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            {trackingInfo.speedKmph} km/h · NH48 Highway
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">ETA</span>
          <div className="text-xl font-black text-neutral-900 dark:text-white">
            {trackingInfo.etaMinutes} min
          </div>
        </div>
      </div>

      {/* Horizontal Mini Timeline */}
      <div className="py-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400 mb-1 px-1">
          {STATUS_STEPS.map((step, idx) => (
            <span 
              key={step.key} 
              className={idx <= currentStepIndex ? 'text-neutral-900 dark:text-white font-bold' : ''}
            >
              {step.label}
            </span>
          ))}
        </div>
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(10, (currentStepIndex + 1) * 16.6))}%` }}
          />
        </div>
      </div>

      {/* Driver Card & Controls */}
      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-white">
            {(shipment.truck?.driver.name || 'R').charAt(0)}
          </div>
          <div>
            <div className="text-xs font-extrabold text-neutral-900 dark:text-white">
              {shipment.truck?.driver.name || 'Rajesh Kumar'}
            </div>
            <div className="text-[10px] text-neutral-500">
              {shipment.truck?.name || 'Ashok Leyland 1618'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMessage}
            className="relative w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            title="Message Driver"
            aria-label="Message Driver"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {shipment && ShipmentService.getUnreadCount(shipment, currentRole) > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
            )}
          </button>
          {(shipment?.truck?.driver?.phone || '+91 98410 44291') && (
            <a
              href={`tel:${(shipment?.truck?.driver?.phone || '+91 98410 44291').replace(/\s+/g, '')}`}
              className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:underline select-all py-1 px-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              title="Call driver"
            >
              {shipment?.truck?.driver?.phone || '+91 98410 44291'}
            </a>
          )}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            title="Share Tracking"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Driver Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                  {(shipment.truck?.driver.name || 'D').charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {shipment.truck?.driver.name || 'Driver'}
                  </h4>
                  <p className="text-[10px] text-emerald-500 font-semibold">Online · On Highway</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-xs font-bold text-neutral-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div 
              ref={chatScrollRef}
              className="space-y-2 h-52 overflow-y-auto pr-1 text-xs scroll-smooth"
            >
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`p-2.5 rounded-2xl max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/60 dark:border-neutral-700/60'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 px-1">
                    {msg.time} {msg.sender === 'user' ? '· Delivered' : ''}
                  </span>
                </div>
              ))}

              {/* Live typing indicator */}
              {isDriverTyping && (
                <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-2xl max-w-[70%] rounded-tl-none border border-neutral-200/60 dark:border-neutral-700/60 animate-pulse">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium italic">
                    {shipment.truck?.driver.name || 'Driver'} is typing...
                  </span>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
              {[
                'Where are you now?',
                'ETA update?',
                'Is cargo secure?',
                'Drive carefully!'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isDriverTyping}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Type message to driver..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!newMessage.trim()}
                className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs disabled:opacity-40 transition-opacity"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Delivery Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-neutral-900 dark:text-white">Shipment Delivered!</h3>
            <p className="text-xs text-neutral-500">
              {shipment?.trackingNumber || 'Shipment'} successfully reached {shipment?.toLocation?.name || 'destination'}. Rate your experience with {shipment?.truck?.driver?.name || 'the driver'}.
            </p>
            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-xl transition-transform hover:scale-125 ${star <= rating ? 'text-amber-400' : 'text-neutral-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowRatingModal(false);
                showToast(`Thank you! Rated ${rating} stars for driver ${shipment?.truck?.driver?.name || 'assigned'}`, 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
