import React, {createContext, useContext, useRef} from 'react';

interface FeedScrollContextType {
  scrollToTop: () => void;
  registerScrollFunction: (fn: () => void) => void;
}

const FeedScrollContext = createContext<FeedScrollContextType | undefined>(undefined);

export const FeedScrollProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const scrollFunctionRef = useRef<(() => void) | null>(null);

  const scrollToTop = () => {
    if (scrollFunctionRef.current) {
      scrollFunctionRef.current();
    }
  };

  const registerScrollFunction = (fn: () => void) => {
    scrollFunctionRef.current = fn;
  };

  return (
    <FeedScrollContext.Provider value={{scrollToTop, registerScrollFunction}}>
      {children}
    </FeedScrollContext.Provider>
  );
};

export const useFeedScroll = () => {
  const context = useContext(FeedScrollContext);
  if (context === undefined) {
    throw new Error('useFeedScroll must be used within a FeedScrollProvider');
  }
  return context;
};
