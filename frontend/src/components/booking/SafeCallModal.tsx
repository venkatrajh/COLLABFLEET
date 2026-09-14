import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Truck as TruckIcon, 
  User, 
  Radio 
} from 'lucide-react';

export const SafeCallModal: React.FC = () => {
  const { 
    activeCallShipment, 
    isCallModalOpen, 
    closeCallModal, 
    currentRole, 
    showToast 
  } = useApp();

  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Connection timer
  useEffect(() => {
    if (!isCallModalOpen) {
      setCallState('connecting');
      setCallDurationSec(0);
      setIsMuted(false);
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 1800);

    return () => clearTimeout(connectTimer);
  }, [isCallModalOpen]);

  // Duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isCallModalOpen && callState === 'connected') {
      interval = setInterval(() => {
        setCallDurationSec(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallModalOpen, callState]);

  if (!activeCallShipment) return null;

  const isShipper = currentRole === 'shipper';
  const targetName = isShipper 
    ? (activeCallShipment.truck?.driver?.name || activeCallShipment.truck?.company || 'Fleet Partner') 
    : (activeCallShipment.shipperName || 'Shipper');

  const targetRole = isShipper ? 'Fleet Partner' : 'Shipper Client';
  const targetCompany = isShipper 
    ? (activeCallShipment.truck?.company || 'Commercial Fleet') 
    : (activeCallShipment.shipperCompany || 'Apex Technologies Freight Co.');

  const maskedPhone = isShipper ? '+91 98410 •••••' : '+91 98401 •••••';

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    const formatted = formatTimer(callDurationSec);
    closeCallModal();
    showToast(`Call ended · Duration: ${formatted}`, 'info');
  };

  return (
    <Modal
      isOpen={isCallModalOpen}
      onClose={handleEndCall}
      maxWidth="max-w-sm"
    >
      <div className="text-center py-3 space-y-5">
        
        {/* Security Shield Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted In-App Contact</span>
        </div>

        {/* Avatar & Pulse Indicator */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {callState === 'connected' && (
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          )}
          {callState === 'connecting' && (
            <span className="absolute inset-0 rounded-full bg-neutral-300/30 animate-pulse" />
          )}
          <div className="relative w-20 h-20 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-xl border-4 border-white">
            {isShipper ? (
              <TruckIcon className="w-9 h-9" />
            ) : (
              <User className="w-9 h-9" />
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-neutral-950 tracking-tight">
            {targetName}
          </h3>
          <p className="text-xs font-semibold text-neutral-500">
            {targetRole} · {targetCompany}
          </p>
          <div className="text-[11px] font-mono text-neutral-400 pt-0.5">
            {maskedPhone} <span className="text-[10px] text-neutral-400 font-sans">(Masked Proxy)</span>
          </div>
        </div>

        {/* Call Status & Timer */}
        <div className="py-2.5 px-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 inline-block min-w-[180px]">
          {callState === 'connecting' ? (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-600">
              <Radio className="w-3.5 h-3.5 text-neutral-500 animate-spin" />
              <span>Connecting line...</span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected</span>
              </div>
              <div className="text-xl font-mono font-black text-neutral-900 tracking-wider">
                {formatTimer(callDurationSec)}
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-[10px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Trip {activeCallShipment.trackingNumber}: Phone numbers remain masked for privacy. Audio is relayed directly inside COLLABFLEET.
        </p>

        {/* Interactive Controls Bar */}
        <div className="pt-2 flex items-center justify-center gap-4">
          
          {/* Mute Button */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            disabled={callState === 'connecting'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
            } disabled:opacity-40`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className="w-16 h-16 rounded-3xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker Button */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            disabled={callState === 'connecting'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isSpeakerOn 
                ? 'bg-neutral-900 text-white' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
            } disabled:opacity-40`}
            title={isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

        </div>

      </div>
    </Modal>
  );
};
