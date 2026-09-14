import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  X, 
  Send, 
  ShieldCheck, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Truck as TruckIcon, 
  Sparkles, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const BookingChatModal: React.FC = () => {
  const { 
    activeChatShipment, 
    isChatModalOpen, 
    closeChatModal, 
    currentRole, 
    userProfile, 
    handleSendMessage 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (isChatModalOpen) {
      setTimeout(() => {
        scrollToBottom(false);
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatModalOpen, activeChatShipment?.id]);

  useEffect(() => {
    if (isChatModalOpen) {
      scrollToBottom(true);
    }
  }, [activeChatShipment?.messages?.length]);

  // Global Escape key listener to close drawer immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatModalOpen) {
        e.preventDefault();
        e.stopPropagation();
        closeChatModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatModalOpen, closeChatModal]);

  if (!isChatModalOpen || !activeChatShipment) return null;

  const isShipper = currentRole === 'shipper';

  // Dynamic party identification based on current role
  const otherPartyRole = isShipper ? 'Fleet Owner' : 'Shipper';
  const otherPartyName = isShipper
    ? (activeChatShipment.truck?.driver?.name || activeChatShipment.truck?.company || 'Fleet Partner')
    : (activeChatShipment.shipperName || 'Shipper');

  const otherPartyPhone = isShipper
    ? (activeChatShipment.truck?.driver?.phone || '+91 98410 44291')
    : (activeChatShipment.shipperPhone || '+91 98401 23456');

  const vehicleInfo = activeChatShipment.truck?.name || 'Commercial Freight Carrier';
  const vehicleReg = activeChatShipment.truck?.registrationNumber || 'KA 03 AA 4521';
  const routeDisplay = `${activeChatShipment.fromLocation?.city || 'Origin'} → ${activeChatShipment.toLocation?.city || 'Destination'}`;

  // Status mapping
  const status = activeChatShipment.status;
  const isMessagingDisabled = status === 'pending' || status === 'declined';
  const isHistoryOnly = status === 'delivered';

  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Booking Confirmed
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            Trip in Progress
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            Trip Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Acceptance
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Request Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {status}
          </span>
        );
    }
  };

  const messages = activeChatShipment.messages || [];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending || isMessagingDisabled) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      await handleSendMessage(activeChatShipment.id, textToSend);
    } finally {
      setIsSending(false);
      setTimeout(() => scrollToBottom(true), 50);
    }
  };

  // Instagram-style quick responses
  const quickReplies = isShipper
    ? [
        "What is your arrival time?",
        "Cargo packed & ready at dock",
        "Gate pass has been issued",
        "Dock Bay 4 is cleared for loading"
      ]
    : [
        "Reaching pickup bay in 15 mins",
        "Vehicle parked at the gate",
        "Cargo loaded & strapped securely",
        "Departing on NH48 corridor"
      ];

  return (
    <div 
      className="fixed top-16 right-0 w-full sm:w-[420px] lg:w-[440px] max-w-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] border-l border-neutral-200 z-[90] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
      style={{ height: 'calc(100vh - 4rem)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${otherPartyName}`}
    >
      
      {/* 1. FIXED, ALWAYS-VISIBLE HEADER AT THE VERY TOP */}
      <div className="shrink-0 sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Entity Avatar */}
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {isShipper ? <TruckIcon className="w-4 h-4 text-white" /> : otherPartyName.charAt(0)}
          </div>

          {/* Title & Route Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 truncate leading-tight">
                {isShipper ? vehicleInfo : otherPartyName}
              </h3>
              <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                {isShipper ? `(${vehicleReg})` : otherPartyRole}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-neutral-500 truncate font-medium">
                {routeDisplay}
              </span>
              <span className="text-neutral-300">•</span>
              <div className="shrink-0">{getStatusBadge()}</div>
            </div>
          </div>
        </div>

        {/* Header Action Buttons: Phone Number (plain tel: link) & CLEARLY VISIBLE X CLOSE BUTTON IN TOP-RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          {!isMessagingDisabled && !isHistoryOnly && otherPartyPhone && (
            <a
              href={`tel:${otherPartyPhone.replace(/\s+/g, '')}`}
              className="text-xs font-mono font-bold text-neutral-800 hover:text-black hover:underline transition-colors tracking-tight select-all py-1.5 px-2 rounded-lg bg-[#FAF9F6] border border-neutral-200 cursor-pointer"
              title={`Call ${otherPartyName}`}
            >
              {otherPartyPhone}
            </a>
          )}

          {/* CLEARLY VISIBLE X CLOSE BUTTON IN TOP-RIGHT CORNER */}
          <button
            type="button"
            onClick={closeChatModal}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:border-rose-200 border border-neutral-200 text-neutral-800 hover:text-rose-600 transition-all flex items-center justify-center shadow-2xs group cursor-pointer"
            title="Close chat (Esc)"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 stroke-[2.5] text-neutral-800 group-hover:text-rose-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* TRIP INFO SUB-BANNER (FIXED BELOW HEADER) */}
      <div className="shrink-0 px-5 py-2 bg-[#FAF9F6] border-b border-neutral-200 flex items-center justify-between text-[11px] text-neutral-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-neutral-900">
            {activeChatShipment.trackingNumber}
          </span>
          <span>•</span>
          <span className="truncate max-w-[180px]">
            {activeChatShipment.cargoType} ({activeChatShipment.weightTons}T)
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Verified Booking</span>
        </div>
      </div>

        {/* CHAT MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-white scrollbar-thin">
          
          {/* Channel Start Announcement */}
          <div className="text-center py-2">
            <span className="px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EBEAE5] text-[10px] font-mono text-neutral-500 font-medium">
              Direct Trip Channel · End-to-End Coordination
            </span>
          </div>

          {/* Access Warning if Pending or Declined */}
          {isMessagingDisabled && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {status === 'pending' ? 'Chat Disabled · Pending Acceptance' : 'Booking Declined'}
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {status === 'pending'
                    ? 'Messaging unlocks immediately once the fleet owner accepts the booking request.'
                    : 'This request was declined. You may find and book another available truck.'}
                </p>
              </div>
            </div>
          )}

          {/* Messages Render */}
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-neutral-700">No messages yet</p>
              <p className="text-[11px] text-neutral-400 max-w-xs">
                Coordinate pickup times, dock bay numbers, or shipment details directly with {otherPartyName}.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderRole === currentRole;
              const prevMsg = messages[index - 1];
              const isSameSender = prevMsg && prevMsg.senderRole === msg.senderRole;

              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSameSender ? 'mt-1' : 'mt-2.5'}`}
                >
                  {/* Sender Name (only shown on the first message in a group for the other party) */}
                  {!isMe && !isSameSender && (
                    <span className="text-[10px] font-bold text-neutral-500 mb-1 px-1">
                      {msg.senderName || otherPartyName}
                    </span>
                  )}

                  {/* Compact Instagram-style Bubble */}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed transition-all ${
                      isMe
                        ? 'bg-neutral-950 text-white rounded-br-xs shadow-xs font-medium'
                        : 'bg-[#F4F3EF] text-neutral-900 border border-neutral-200/90 rounded-bl-xs font-medium'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    
                    {/* Timestamp & Status inside/below bubble */}
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono ${
                      isMe ? 'text-neutral-400' : 'text-neutral-400'
                    }`}>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTION CHIPS */}
        {!isMessagingDisabled && !isHistoryOnly && (
          <div className="px-3.5 py-2 bg-[#FAF9F6] border-t border-[#EBEAE5] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputMessage(qr);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-xl bg-white border border-[#E0DFD8] hover:border-neutral-900 text-[10px] font-semibold text-neutral-700 hover:text-neutral-950 shrink-0 transition-colors shadow-2xs"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* CHAT INPUT FORM */}
        <form 
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-[#EBEAE5] flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isMessagingDisabled}
            placeholder={
              isMessagingDisabled 
                ? 'Messaging locked until booking is accepted...' 
                : 'Type a message...'
            }
            className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E0DFD8] focus:border-neutral-950 focus:bg-white text-xs font-medium outline-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending || isMessagingDisabled}
            className="w-10 h-10 rounded-2xl bg-neutral-950 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center shrink-0 hover:scale-105 active:scale-95"
            title="Send (Enter)"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    );
  };
