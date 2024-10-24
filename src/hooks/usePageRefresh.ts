import { useEffect } from 'react';

function usePageRefresh() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Display a custom message in modern browsers
      const message =
        'Are you sure you want to refresh? Your current session will get disconnected';
      event.preventDefault(); // Most browsers don't require this anymore
      event.returnValue = message; // This will show the confirmation dialog
      return message; // For some browsers, this line is necessary
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

export default usePageRefresh;
