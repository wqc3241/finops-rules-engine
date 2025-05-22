
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';

interface NavigationOptions {
  updateUrl?: boolean;
  markAsPresented?: boolean;
}

export function useDealFinancialNavigation() {
  const navigate = useNavigate();
  const { id: applicationId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { presentedLender, markLenderAsPresented } = usePresentedLender();

  // Navigate to financial summary with specific section
  const navigateToFinancialSection = (
    lenderName: string,
    section: 'requested' | 'approved' | 'customer',
    options: NavigationOptions = {}
  ) => {
    const { updateUrl = true, markAsPresented = false } = options;
    
    if (markAsPresented) {
      markLenderAsPresented(lenderName);
    }
    
    if (updateUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('view', 'financial-detail');
      newParams.set('section', section);
      newParams.set('lender', encodeURIComponent(lenderName));
      
      if (applicationId) {
        navigate(`/applications/${applicationId}/financial-summary?${newParams.toString()}`);
      } else {
        setSearchParams(newParams);
      }
    }
    
    return { section, lenderName };
  };

  // Navigate to specific deal structure
  const navigateToDealStructure = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('view');
    setSearchParams(newParams);
  };

  // Get current lender from URL
  const getCurrentLender = (): string | null => {
    const lenderParam = searchParams.get('lender');
    return lenderParam ? decodeURIComponent(lenderParam) : null;
  };

  // Get current section from URL
  const getCurrentSection = (): 'requested' | 'approved' | 'customer' | null => {
    const sectionParam = searchParams.get('section') as 'requested' | 'approved' | 'customer' | null;
    return sectionParam;
  };

  return {
    navigateToFinancialSection,
    navigateToDealStructure,
    getCurrentLender,
    getCurrentSection,
    presentedLender,
    markLenderAsPresented
  };
}
