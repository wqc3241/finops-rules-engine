import { useState, useEffect, useCallback } from 'react';
import { Application, Note, ApplicationFullDetails } from '@/types/application';
import { ApplicationService } from '@/services/applicationService';
import { supabase } from '@/integrations/supabase/client';

const transformToFullDetails = (app: Application): ApplicationFullDetails => {
  return {
    details: {
      orderNumber: app.orderNumber,
      model: app.model || '',
      edition: app.edition || '',
      orderedBy: app.orderedBy || '',
      status: app.status,
      type: app.type,
      reapplyEnabled: app.reapplyEnabled,
      reapplicationSequence: app.reapplicationSequence,
      originalApplicationId: app.originalApplicationId,
      parentApplicationId: app.parentApplicationId,
    },
    applicantInfo: app.applicantInfo,
    coApplicantInfo: app.coApplicantInfo,
    vehicleData: app.vehicleData,
    appDtReferences: app.appDtReferences,
    orderDetails: app.orderDetails,
    financialSummary: app.financialSummary,
    dealStructure: app.dealStructure,
    history: app.history,
    notes: app.notesArray,
  };
};

export const useSupabaseApplicationDetail = (id: string | undefined) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const loadApplication = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await ApplicationService.fetchApplicationById(id);
      setApplication(data);
    } catch (error) {
      console.error('Failed to load application:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`application-${id}-notes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'application_notes',
          filter: `application_id=eq.${id}`,
        },
        () => {
          loadApplication();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, loadApplication]);

  const addNote = async (note: Omit<Note, 'id'>) => {
    if (!id) return;
    setIsAddingNote(true);
    try {
      await ApplicationService.addNote(id, note);
      await loadApplication();
    } finally {
      setIsAddingNote(false);
    }
  };

  return {
    application,
    applicationFullDetails: application ? transformToFullDetails(application) : null,
    loading,
    isAddingNote,
    addNote,
    refreshApplication: loadApplication,
  };
};
