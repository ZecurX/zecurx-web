"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateTimePickerProps {
    name?: string;
    onChange?: (date: Date | null) => void;
    required?: boolean;
    minDate?: Date;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Generate time slots (9 AM to 6 PM, 30 min intervals)
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 30; // Start at 9:00 AM
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return {
        label: `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`,
        value: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    };
});

export default function DateTimePicker({ name, onChange, required, minDate }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calendar logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const handleDateSelect = (date: Date) => {
        const newDate = new Date(date);
        if (selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            newDate.setHours(hours, minutes);
            // Auto-close if time is already selected
            setIsOpen(false);
        }
        setSelectedDate(newDate);
        if (onChange) onChange(newDate);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            const [hours, minutes] = time.split(':').map(Number);
            newDate.setHours(hours, minutes);
            setSelectedDate(newDate);
            if (onChange) onChange(newDate);
            // Auto-close after selecting time when date is already selected
            setIsOpen(false);
        }
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
        // Allow going back only if the previous month is not before the minDate's month
        if (minDate) {
            const minMonthDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
            if (prev < minMonthDate) return;
        }
        setCurrentMonth(prev);
    };

    // Format display value
    const getDisplayValue = () => {
        if (!selectedDate) return "";
        const dateStr = selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        const timeStr = selectedTime ? TIME_SLOTS.find(t => t.value === selectedTime)?.label : '';
        return timeStr ? `${dateStr}, ${timeStr}` : dateStr;
    };

    // Hidden input value for form submission (ISO string)
    const hiddenValue = selectedDate && selectedTime 
        ? selectedDate.toISOString() 
        : '';

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Hidden Input for Form Data */}
            <input type="hidden" name={name} value={hiddenValue} required={required} />

            {/* Trigger Button */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-muted/20 border ${isOpen ? 'border-blue-500/50 bg-muted/30' : 'border-border'} rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-muted/30 group`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <CalendarIcon className={`w-5 h-5 ${selectedDate ? 'text-blue-400' : 'text-muted-foreground'}`} />
                    <span className={`text-sm truncate ${selectedDate ? 'text-foreground font-medium' : 'text-muted-foreground/50'}`}>
                        {getDisplayValue() || "Select Date & Time"}
                    </span>
                </div>
                {selectedDate ? (
                    <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(null);
                            setSelectedTime(null);
                            if (onChange) onChange(null);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </div>
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 rotate-90" />
                )}
            </div>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col sm:flex-row h-auto sm:h-[340px] max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible"
                    >
                        {/* Calendar Section */}
                        <div className="p-4 sm:flex-1 border-b sm:border-b-0 sm:border-r border-border min-w-[280px] sm:h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <button 
                                    type="button" 
                                    onClick={prevMonth} 
                                    disabled={minDate && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) <= new Date(minDate.getFullYear(), minDate.getMonth(), 1)}
                                    className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-semibold text-foreground">
                                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button type="button" onClick={nextMonth} className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
                                {DAYS.map(day => (
                                    <div key={day} className="text-xs text-center text-muted-foreground font-medium py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1 overflow-y-auto">
                                {getDaysInMonth(currentMonth).map((date, i) => {
                                    if (!date) return <div key={`empty-${i}`} />;
                                    
                                    const isSelected = selectedDate && 
                                        date.getDate() === selectedDate.getDate() &&
                                        date.getMonth() === selectedDate.getMonth() &&
                                        date.getFullYear() === selectedDate.getFullYear();
                                    
                                    const isToday = new Date().toDateString() === date.toDateString();

                                    // Check if date is disabled (before minDate)
                                    // Set time to 00:00:00 for accurate date comparison
                                    const isBeforeMinDate = minDate ? 
                                        new Date(date.getFullYear(), date.getMonth(), date.getDate()) < 
                                        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) 
                                        : false;

                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => !isBeforeMinDate && handleDateSelect(date)}
                                            disabled={isBeforeMinDate}
                                            className={`
                                                text-sm p-2 rounded-lg transition-all relative
                                                ${isSelected 
                                                    ? 'bg-primary text-primary-foreground font-medium shadow-md' 
                                                    : isBeforeMinDate
                                                        ? 'text-muted-foreground/30 cursor-not-allowed'
                                                        : 'text-foreground hover:bg-muted hover:text-primary'
                                                }
                                                ${isToday && !isSelected && !isBeforeMinDate ? 'text-primary font-medium' : ''}
                                            `}
                                        >
                                            {date.getDate()}
                                            {isToday && !isSelected && !isBeforeMinDate && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Section */}
                        <div className="flex flex-col w-full sm:w-[160px] bg-muted/30 border-t sm:border-t-0 h-[200px] sm:h-full">
                            <div className="p-3 border-b border-border flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 shrink-0">
                                <Clock className="w-4 h-4" />
                                <span>Time</span>
                            </div>
                            <div 
                                className="overflow-y-auto flex-1 p-2 space-y-1 overscroll-contain"
                                data-lenis-prevent
                                onWheel={(e) => e.stopPropagation()}
                            >
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot.value}
                                        type="button"
                                        onClick={() => handleTimeSelect(slot.value)}
                                        className={`
                                            w-full text-left px-3 py-2 text-xs rounded-lg transition-colors shrink-0
                                            ${selectedTime === slot.value 
                                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }
                                        `}
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}