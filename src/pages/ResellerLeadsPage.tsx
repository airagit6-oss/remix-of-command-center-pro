import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useConvertLead } from '@/hooks/useReseller';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, CheckCircle, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'sonner';

// NO MOCK DATA - REAL API ONLY
export default function ResellerLeadsPage() {
  const { t } = useTranslation('common');
  const { data: leads, isLoading } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const convertLead = useConvertLead();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
    value: 0,
  });

  const handleSubmit = () => {
    if (editingId) {
      updateLead.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          setEditingId(null);
          setFormData({ name: '', email: '', phone: '', source: '', notes: '', value: 0 });
        }
      });
    } else {
      createLead.mutate(formData, {
        onSuccess: () => {
          setIsAdding(false);
          setFormData({ name: '', email: '', phone: '', source: '', notes: '', value: 0 });
        }
      });
    }
  };

  const handleEdit = (lead: { id: string; name: string; email: string; phone?: string; source: string; notes: string; value: number }) => {
    setEditingId(lead.id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      source: lead.source,
      notes: lead.notes,
      value: lead.value,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('confirm_delete_lead'))) {
      deleteLead.mutate(id);
    }
  };

  const handleConvert = (id: string) => {
    convertLead.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('my_leads')}</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_lead')}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t('edit_lead') : t('new_lead')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder={t('name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder={t('email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="tel"
                placeholder={t('phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder={t('source')}
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder={t('estimated_value')}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder={t('notes')}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border rounded px-3 py-2 md:col-span-2"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit}>
                {editingId ? t('update') : t('create')}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', email: '', phone: '', source: '', notes: '', value: 0 });
              }}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {leads?.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(lead.status)}`}>
                      {t(lead.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-muted-foreground mb-1">{lead.phone}</p>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('source')}: {lead.source}
                  </p>
                  {lead.notes && (
                    <p className="text-sm text-muted-foreground mb-2">{lead.notes}</p>
                  )}
                  <p className="text-sm font-medium">
                    {t('estimated_value')}: ${lead.value?.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleConvert(lead.id)}
                      disabled={convertLead.isPending}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {t('convert')}
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(lead)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(lead.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads?.length === 0 && !isAdding && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t('no_leads_yet')}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('start_by_adding_first_lead')}
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_lead')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
