'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Upload,
  Loader2,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Globe,
  Star,
  Trash2,
  CheckCircle,
  Eye,
  X,
  FlaskConical,
  Download,
  ExternalLink,
} from 'lucide-react';
import { CertificateTemplate } from '@/types/seminar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
const MAX_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CertificateTemplateSection({
  seminarId,
  canManage,
  selectedTemplateId,
  onSelectionChange,
  seminarTitle,
  seminarDate,
  speakerName,
  organizationName,
}: {
  seminarId: string;
  canManage: boolean;
  selectedTemplateId: string | null;
  onSelectionChange: () => void;
  seminarTitle?: string;
  seminarDate?: string;
  speakerName?: string;
  organizationName?: string;
}) {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<{ url: string; title: string } | null>(null);

  const [testName, setTestName] = useState('Jane Doe');
  const [testTitle, setTestTitle] = useState(seminarTitle || '');
  const [testDate, setTestDate] = useState((seminarDate || '').slice(0, 10));
  const [testSpeaker, setTestSpeaker] = useState(speakerName || '');
  const [testOrganization, setTestOrganization] = useState(organizationName || '');
  const [testLocation, setTestLocation] = useState('');
  const [testGenerating, setTestGenerating] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testPdfUrl, setTestPdfUrl] = useState<string | null>(null);

  const handleTestGenerate = async () => {
    if (!testName.trim() || !testTitle.trim() || !testDate) {
      setTestError('Recipient name, seminar title and seminar date are required.');
      return;
    }

    setTestGenerating(true);
    setTestError(null);
    if (testPdfUrl) URL.revokeObjectURL(testPdfUrl);
    setTestPdfUrl(null);

    try {
      const res = await fetch('/api/admin/certificate-template/test-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seminarId,
          recipientName: testName.trim(),
          seminarTitle: testTitle.trim(),
          seminarDate: testDate,
          speakerName: testSpeaker.trim() || null,
          organization: testOrganization.trim() || null,
          location: testLocation.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTestError(data.error || 'Failed to generate test certificate');
        return;
      }

      const blob = await res.blob();
      setTestPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Error generating test certificate:', err);
      setTestError('An error occurred while generating the test certificate');
    } finally {
      setTestGenerating(false);
    }
  };

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/certificate-template');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (err) {
      console.error('Failed to fetch certificate templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    return () => {
      if (testPdfUrl) URL.revokeObjectURL(testPdfUrl);
    };
  }, [testPdfUrl]);

  const defaultTemplate = templates.find((t) => t.is_default) || null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);
    setSuccess(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG or JPEG image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    setPendingFile(file);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append('seminarId', seminarId);
      formData.append('setAsDefault', String(setAsDefault));

      const res = await fetch('/api/admin/certificate-template', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setTemplates((prev) => [
          data.template,
          ...(data.template.is_default ? prev.map((t) => ({ ...t, is_default: false })) : prev),
        ]);
        setSuccess('Template uploaded. Select it below to use it for this seminar.');
        setPendingFile(null);
        setSetAsDefault(false);
      } else {
        setError(data.error || 'Failed to upload template');
      }
    } catch (err) {
      console.error('Error uploading certificate template:', err);
      setError('An error occurred while uploading the template');
    } finally {
      setUploading(false);
    }
  };

  const selectTemplateForSeminar = async (templateId: string | null) => {
    setBusyId(templateId || 'default');
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_template_id: templateId }),
      });
      if (res.ok) {
        setSuccess('This seminar will now use the selected template.');
        onSelectionChange();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update seminar template');
      }
    } catch (err) {
      console.error('Error selecting template:', err);
      setError('An error occurred while selecting the template');
    } finally {
      setBusyId(null);
    }
  };

  const makeDefault = async (templateId: string) => {
    setBusyId(templateId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/certificate-template/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        setTemplates((prev) => prev.map((t) => ({ ...t, is_default: t.id === templateId })));
        setSuccess('Default template updated for all seminars that haven’t picked their own.');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to set default template');
      }
    } catch (err) {
      console.error('Error setting default template:', err);
      setError('An error occurred while setting the default template');
    } finally {
      setBusyId(null);
    }
  };

  const removeTemplate = async (templateId: string) => {
    if (!confirm('Delete this template? Any seminar using it will fall back to the default template.')) return;

    setBusyId(templateId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/certificate-template/${templateId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
        if (selectedTemplateId === templateId) onSelectionChange();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete template');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('An error occurred while deleting the template');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground text-sm">Shared template library</p>
          <p className="text-sm text-muted-foreground mt-1">
            Templates uploaded here are available to every seminar. Pick which one this seminar
            should use below, or leave it on &ldquo;Library default&rdquo; to follow whichever
            template is marked default. If no templates exist, the bundled ZecurX certificate is
            used.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Library default "card" - represents "no explicit selection" */}
        <div
          className={cn(
            'rounded-xl border-2 p-4 transition-colors bg-card/40',
            selectedTemplateId === null
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border/50',
          )}
        >
          <button
            onClick={() => selectTemplateForSeminar(null)}
            disabled={!canManage || busyId !== null || selectedTemplateId === null}
            className={cn('block w-full text-left', !canManage && 'cursor-default')}
          >
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center mb-3">
              {defaultTemplate ? (
                <Image
                  src={defaultTemplate.image_url}
                  alt="Library default template"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground text-sm">Library default</p>
              {selectedTemplateId === null && (
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {defaultTemplate ? defaultTemplate.name || defaultTemplate.original_filename : 'Bundled ZecurX template'}
            </p>
          </button>
          {busyId === 'default' && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
          {defaultTemplate && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-7 mt-3"
              onClick={() =>
                setViewingTemplate({
                  url: defaultTemplate.image_url,
                  title: defaultTemplate.name || defaultTemplate.original_filename,
                })
              }
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Button>
          )}
        </div>

        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isBusy = busyId === template.id;

          return (
            <div
              key={template.id}
              className={cn(
                'rounded-xl border-2 p-4 transition-colors bg-card/40',
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50',
              )}
            >
              <button
                onClick={() => selectTemplateForSeminar(template.id)}
                disabled={!canManage || busyId !== null || isSelected}
                className={cn('block w-full text-left', !canManage && 'cursor-default')}
              >
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border/50 bg-muted mb-3">
                  <Image
                    src={template.image_url}
                    alt={template.name || template.original_filename}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground text-sm truncate">
                    {template.name || template.original_filename}
                  </p>
                  {isSelected && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                </div>
              </button>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {template.is_default && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-600 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-current" /> Default
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">{formatFileSize(template.file_size)}</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('text-xs h-7', canManage ? '' : 'flex-1')}
                  onClick={() =>
                    setViewingTemplate({
                      url: template.image_url,
                      title: template.name || template.original_filename,
                    })
                  }
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                {canManage && (
                  <>
                    {!template.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs h-7"
                        disabled={isBusy}
                        onClick={() => makeDefault(template.id)}
                      >
                        {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Set as default'}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shrink-0"
                      disabled={isBusy}
                      onClick={() => removeTemplate(template.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {canManage && (
        <div className="bg-card/40 border border-border/50 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Upload New Template</h2>

          {pendingFile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{pendingFile.name}</p>
                  <p className="text-muted-foreground text-xs">{formatFileSize(pendingFile.size)}</p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                Set as the library default (used by seminars that haven&apos;t picked one)
              </label>
              <div className="flex gap-2">
                <Button onClick={handleConfirmUpload} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to Library
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPendingFile(null);
                    setSetAsDefault(false);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <label
              className={cn(
                'flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
                'border-border hover:border-primary/50 hover:bg-muted/30',
              )}
            >
              <Upload className="w-7 h-7 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload a new template</p>
              <p className="text-xs text-muted-foreground mt-1">PNG or JPEG, max 10MB</p>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg"
                onChange={handleFileSelect}
              />
            </label>
          )}
        </div>
      )}

      <div className="bg-card/40 border border-border/50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-foreground">Test Certificate Generation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Renders a PDF using the exact template this seminar currently uses, with the sample
              details below. Nothing is saved, emailed, or added to the certificates list &mdash;
              this is only for checking how the layout looks.
            </p>
          </div>
        </div>

        {testError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {testError}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-name">Recipient Name</Label>
            <Input
              id="test-cert-name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-title">Seminar Title</Label>
            <Input
              id="test-cert-title"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Intro to Cybersecurity"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-date">Seminar Date</Label>
            <Input
              id="test-cert-date"
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-location">Place</Label>
            <Input
              id="test-cert-location"
              value={testLocation}
              onChange={(e) => setTestLocation(e.target.value)}
              placeholder="India"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-speaker">Speaker Name</Label>
            <Input
              id="test-cert-speaker"
              value={testSpeaker}
              onChange={(e) => setTestSpeaker(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="test-cert-org">Organization</Label>
            <Input
              id="test-cert-org"
              value={testOrganization}
              onChange={(e) => setTestOrganization(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleTestGenerate} disabled={testGenerating}>
            {testGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FlaskConical className="w-4 h-4 mr-2" />
                Generate Test PDF
              </>
            )}
          </Button>
          {testPdfUrl && (
            <>
              <Button asChild variant="outline">
                <a href={testPdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={testPdfUrl} download="certificate-test-preview.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </>
          )}
        </div>

        {testPdfUrl && (
          <div className="rounded-lg border border-border/50 overflow-hidden bg-muted" style={{ height: '70vh' }}>
            <iframe src={testPdfUrl} title="Certificate test preview" className="w-full h-full" />
          </div>
        )}
      </div>

      {viewingTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingTemplate(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <p className="font-medium text-foreground text-sm truncate">{viewingTemplate.title}</p>
              <button
                onClick={() => setViewingTemplate(null)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full aspect-[16/9] bg-muted">
              <Image
                src={viewingTemplate.url}
                alt={viewingTemplate.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
