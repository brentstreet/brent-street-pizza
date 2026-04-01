import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/content`);
      if (!res.ok) throw new Error('Failed to fetch content');
      const data = await res.json();
      setContent(data.content);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching UI content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Helper hook for specific sections
export const useSectionContent = (section: string) => {
  const { content, loading } = useContent();
  return { 
    sectionContent: content[section] || {}, 
    loading 
  };
};
