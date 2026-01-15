'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Tag, Check, Loader2, RefreshCw } from 'lucide-react';
import { BlogLabel } from '@/types/auth';
import { cn } from '@/lib/utils';

interface LabelSelectorProps {
  selectedLabels: string[];
  onChange: (labelIds: string[]) => void;
  onCreateLabel?: (name: string, color: string) => Promise<BlogLabel>;
}

export default function LabelSelector({ 
  selectedLabels, 
  onChange,
  onCreateLabel 
}: LabelSelectorProps) {
  const [labels, setLabels] = useState<BlogLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3B82F6');
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowCreateForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLabels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog/labels');
      if (response.ok) {
        const data = await response.json();
        setLabels(data);
      }
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      onChange(selectedLabels.filter(id => id !== labelId));
    } else {
      onChange([...selectedLabels, labelId]);
    }
  };

  const handleRemoveLabel = (labelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedLabels.filter(id => id !== labelId));
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim() || !onCreateLabel) return;

    setCreating(true);
    try {
      const newLabel = await onCreateLabel(newLabelName.trim(), newLabelColor);
      setLabels([...labels, newLabel]);
      onChange([...selectedLabels, newLabel.id]);
      setNewLabelName('');
      setNewLabelColor('#3B82F6');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create label:', error);
      alert('Failed to create label. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getSelectedLabelObjects = () => {
    return labels.filter(label => selectedLabels.includes(label.id));
  };

  const predefinedColors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[48px] p-3 border border-border/50 rounded-xl bg-background/50">
        {getSelectedLabelObjects().map(label => (
          <span
            key={label.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
            <button
              type="button"
              onClick={(e) => handleRemoveLabel(label.id, e)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {selectedLabels.length === 0 && (
          <span className="text-sm text-muted-foreground">No labels selected</span>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted/50 border border-border/50 rounded-lg hover:bg-muted transition-colors"
        >
          <Tag className="w-4 h-4" />
          Add Label
        </button>

        {showDropdown && (
          <div className="absolute z-50 mt-2 w-full max-w-xs bg-card border border-border/50 rounded-xl shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
              <span className="text-xs font-medium text-muted-foreground">Select Labels</span>
              <button 
                onClick={fetchLabels} 
                className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                title="Refresh labels"
              >
                <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
              </button>
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center gap-2 p-4">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Loading labels...</span>
                </div>
              ) : labels.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">No labels available</p>
              ) : (
                labels.map(label => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => handleToggleLabel(label.id)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-foreground font-medium">{label.name}</span>
                    </span>
                    {selectedLabels.includes(label.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>

            {showCreateForm ? (
              <div className="border-t border-border/50 p-4 space-y-3 bg-muted/20">
                <input
                  type="text"
                  placeholder="Label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateLabel();
                    }
                  }}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  disabled={creating}
                />
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Choose Color</p>
                  <div className="flex gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewLabelColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all shadow-sm",
                          newLabelColor === color 
                            ? 'border-foreground scale-110' 
                            : 'border-transparent hover:scale-105'
                        )}
                        style={{ backgroundColor: color }}
                        disabled={creating}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateLabel}
                    disabled={!newLabelName.trim() || creating}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </span>
                    ) : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewLabelName('');
                      setNewLabelColor('#3B82F6');
                    }}
                    disabled={creating}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : onCreateLabel ? (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 border-t border-border/50 rounded-b-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Label
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
