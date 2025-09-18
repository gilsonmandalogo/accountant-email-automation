'use client';

import sendDoneEvent from '@/app/actions/sendDoneEvent';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';

export default function ButtonSendDoneEvent() {
  const handleDone = useCallback(() => {
    (async () => {
      await sendDoneEvent();
      window.close();
    })();
  }, []);

  return (
    <Button onClick={handleDone} variant="secondary" size="lg">
      Done
    </Button>
  );
}
