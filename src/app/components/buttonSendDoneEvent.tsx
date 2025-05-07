'use client';

import sendDoneEvent from '@/app/actions/sendDoneEvent';
import { useCallback } from 'react';

export default function ButtonSendDoneEvent() {
  const handleDone = useCallback(() => {
    (async () => {
      await sendDoneEvent();
      window.close();
    })();
  }, []);

  return (
    <div className='vertical'>
      <button onClick={handleDone}>Done</button>
    </div>
  );
}
