'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Tag, Check } from 'lucide-react';
import { BlogLabel } from '@/types/auth';

interface LabelSelectorProps {
  selectedLabels: string[]; // Array of label IDs
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

  // Fetch labels on mount
  useEffect(() => {
    fetchLabels();
  }, []);

  // Click outside to close dropdown
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
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Labels
      </label>

      {/* Selected Labels */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white">
        {getSelectedLabelObjects().map(label => (
          <span
            key={label.id}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
            <button
              type="button"
              onClick={(e) => handleRemoveLabel(label.id, e)}
              className="hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {selectedLabels.length === 0 && (
          <span className="text-sm text-gray-400">No labels selected</span>
        )}
      </div>

      {/* Add Label Button */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Tag className="w-4 h-4" />
        Add Label
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="relative z-10 mt-2 w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500 p-2">Loading labels...</p>
            ) : labels.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No labels available</p>
            ) : (
              labels.map(label => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => handleToggleLabel(label.id)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </span>
                  {selectedLabels.includes(label.id) && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Create New Label Form */}
          {showCreateForm ? (
            <div className="border-t border-gray-200 p-3 space-y-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={creating}
              />
              
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Color</p>
                <div className="flex gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewLabelColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        newLabelColor === color ? 'border-gray-800' : 'border-transparent'
                      }`}
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
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewLabelName('');
                    setNewLabelColor('#3B82F6');
                  }}
                  disabled={creating}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : onCreateLabel ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
            >
              <Plus className="w-4 h-4" />
              Create New Label
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
