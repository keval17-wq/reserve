'use client';

import React from 'react';
import EmailTemplateForm from '@/components/settings/emailTemplateForm';
import SenderInfoForm from '@/components/settings/senderInfoForm';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold">Email Settings</h1>
      <SenderInfoForm />
      <EmailTemplateForm />
    </div>
  );
}
