'use server';

export default async function sendDoneEvent() {
  const response = await fetch('http://supervisor/core/api/events/accountant_email_automation_done', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPERVISOR_TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to send done event');
  }

  console.log('Done event sent successfully');
}
