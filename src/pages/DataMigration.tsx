import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const DataMigration = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMigration = async () => {
    setStatus('migrating');
    setMessage('Migration in progress... This may take a few minutes.');

    try {
      const { migrateLocalStorageToSupabase } = await import('../../scripts/migrateToSupabase.ts');
      await migrateLocalStorageToSupabase();
      
      setStatus('success');
      setMessage('Migration completed successfully! All data has been transferred to Supabase.');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Migration failed: ${error.message}`);
      console.error('Migration error:', error);
    }
  };

  const handleSeedMockData = async () => {
    setStatus('migrating');
    setMessage('Seeding mock data... This may take a few minutes.');

    try {
      const { seedMockData } = await import('../../scripts/seedMockData.ts');
      await seedMockData();
      
      setStatus('success');
      setMessage('Mock data seeded successfully! All sample applications have been added to the database.');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Seeding failed: ${error.message}`);
      console.error('Seeding error:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} activeItem="data-migration" setActiveItem={() => {}} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Data Migration</h1>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Migrate your application data from localStorage to Supabase database for better performance,
              real-time synchronization, and automatic backups.
            </p>

            <div className="bg-muted/50 border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What will be migrated:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>All application records</li>
                <li>Applicant information (primary & co-applicant)</li>
                <li>Vehicle data and details</li>
                <li>Application notes and history</li>
                <li>Deal structures with offers and stipulations</li>
                <li>Order details and financial summaries</li>
              </ul>
            </div>

            {status === 'idle' && (
              <div className="flex gap-4">
                <Button onClick={handleMigration} size="lg" variant="outline">
                  Migrate from localStorage
                </Button>
                <Button onClick={handleSeedMockData} size="lg">
                  Seed Mock Data (~50 Apps)
                </Button>
              </div>
            )}

            {status === 'migrating' && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <div className="mt-6">
                <Button onClick={() => window.location.href = '/applications'} variant="outline">
                  Go to Applications
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataMigration;
