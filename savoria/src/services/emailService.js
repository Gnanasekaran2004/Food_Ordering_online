import emailjs from '@emailjs/browser';

/**
 * Sends a contact form submission to the configured EmailJS service.
 * @param {Object} formData 
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.phone
 * @param {string} formData.inquiry_type
 * @param {string} formData.message
 */
export async function sendContactEmail(formData) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS is not fully configured in the environment variables.');
  }

  // Format the date/time (e.g. 21 August 2026, 06:30 AM IST)
  // Assuming the restaurant is in India, but using browser locale for presentation 
  // or a specific timezone. Let's use Indian Standard Time as requested.
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const templateParams = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone ? formData.phone.trim() : 'Not provided',
    inquiry_type: formData.inquiry_type || formData.subject || 'General Inquiry',
    message: formData.message.trim(),
    submitted_at: submittedAt,
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error; // Rethrow to let the UI handle the error state
  }
}
