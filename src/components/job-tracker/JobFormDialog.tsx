'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import type { JobApplicationInput, JobStatus } from '@/lib/job-tracker/types';
import { JOB_STATUS_LABELS } from '@/lib/job-tracker/types';
import { validateJobInput } from '@/lib/job-tracker/validation';

type Props = {
  onCreate: (input: JobApplicationInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

const initialState: JobApplicationInput = {
  title: '',
  company: '',
  location: '',
  salary: '',
  jobUrl: '',
  status: 'saved',
  notes: '',
  rating: 2,
  tags: [],
  atsKeywords: [],
};

export function JobFormDialog({ onCreate, isSubmitting = false }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<JobApplicationInput>(initialState);
  const [errorText, setErrorText] = useState('');

  const errors = useMemo(() => validateJobInput(form), [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (errors.length > 0) {
      setErrorText(errors[0]);
      return;
    }
    setErrorText('');
    await onCreate({
      ...form,
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      salary: form.salary.trim(),
      jobUrl: form.jobUrl.trim(),
      notes: form.notes.trim(),
      tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
      atsKeywords: form.atsKeywords.map((keyword) => keyword.trim()).filter(Boolean),
    });
    setForm(initialState);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a job to your board</DialogTitle>
            <DialogDescription>Track one opportunity and move it through your pipeline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-company">Company</Label>
                <Input
                  id="job-company"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-role">Role</Label>
                <Input
                  id="job-role"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-location">Location</Label>
                <Input
                  id="job-location"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-salary">Salary</Label>
                <Input
                  id="job-salary"
                  value={form.salary}
                  onChange={(e) => setForm((prev) => ({ ...prev, salary: e.target.value }))}
                  placeholder="e.g. ₹18-24 LPA"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as JobStatus }))}
                >
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-url">Job URL</Label>
              <Input
                id="job-url"
                value={form.jobUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, jobUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-notes">Notes</Label>
              <Textarea
                id="job-notes"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Why this role? What should you follow up on?"
                required
              />
            </div>

            {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add to board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
