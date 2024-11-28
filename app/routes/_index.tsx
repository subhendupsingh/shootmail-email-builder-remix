import { useEffect, useState, useRef } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { ShootmailEditor, MailPreview } from '@shootmail/email-builder';
import '@shootmail/email-builder/dist/shootmail.css';

export const meta: MetaFunction = () => {
  return [
    { title: "Shootmail Editor Example" },
    { name: "description", content: "Example integration of Shootmail editor" },
  ];
};

export default function Index() {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      // Initialize editor after component is mounted
      const editorElement = document.getElementById('shootmail-editor');
      if (editorElement && !editorRef.current) {
        editorRef.current = new ShootmailEditor({
          elementId: 'shootmail-editor',
          imageServiceUrl: {
            url: 'YOUR_UPLOAD_URL',
            token: 'YOUR_TOKEN'
          },
          theme: {
            borderRadius: '8',
            padding: true,
            light: {
              editorBackground: '#ffffff',
              editorBorder: '#e2e8f0',
              emailBackground: '#f8fafc'
            },
            dark: {
              editorBackground: '#1e293b',
              editorBorder: '#334155',
              emailBackground: '#0f172a'
            }
          }
        });

        const previewButton = document.getElementById('preview-button');
        if (previewButton) {
          const handlePreview = () => {
            if (editorRef.current) {
              editorRef.current.getHTML();
            }
          };
          previewButton.addEventListener('click', handlePreview);
          return () => {
            if (editorRef.current) {
              editorRef.current.destroy();
              editorRef.current = null;
            }
            previewButton.removeEventListener('click', handlePreview);
          };
        }
      }
    }
  }, [isMounted]);

  if (!isMounted) {
    return <div className="min-h-[600px] border rounded-lg">Loading editor...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shootmail Editor Example</h1>
      
      <div className="flex gap-4 mb-4">
        <button
          id="preview-button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Preview Email
        </button>
      </div>

      <div id="shootmail-editor" className="min-h-[600px] border rounded-lg" />
    </div>
  );
}