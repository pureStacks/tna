import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import HeaderSettings from './settings/HeaderSettings';
import HomeSettings from './settings/HomeSettings';
import AboutSettings from './settings/AboutSettings';
import FeaturesSettings from './settings/FeaturesSettings';
import ContactSettings from './settings/ContactSettings';
import FooterSettings from './settings/FooterSettings';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (key: string) => {
    try {
      const res = await fetch(`/api/cms/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings[key])
      });
      if (res.ok) {
        toast.success(`${key} section saved successfully`);
      } else {
        toast.error('Failed to save section');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const updateSetting = (section: string, data: any) => {
    setSettings({
      ...settings,
      [section]: data
    });
  };

  if (loading) return <div>Loading settings...</div>;

  const tabs = [
    { id: 'header', label: 'Header (Nav)' },
    { id: 'home', label: 'Hero (Home)' },
    { id: 'about', label: 'About Us' },
    { id: 'features', label: 'Features (Why Us)' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'footer', label: 'Footer' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-green-600 text-green-700 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-8">
        {activeTab === 'header' && settings.header && (
          <HeaderSettings data={settings.header} onChange={(data) => updateSetting('header', data)} onSave={() => handleSave('header')} />
        )}
        
        {activeTab === 'home' && settings.home && (
          <HomeSettings data={settings.home} onChange={(data) => updateSetting('home', data)} onSave={() => handleSave('home')} />
        )}
        
        {activeTab === 'about' && settings.about && (
          <AboutSettings data={settings.about} onChange={(data) => updateSetting('about', data)} onSave={() => handleSave('about')} />
        )}
        
        {activeTab === 'features' && (
          <FeaturesSettings data={settings.features || {}} onChange={(data) => updateSetting('features', data)} onSave={() => handleSave('features')} />
        )}
        
        {activeTab === 'contact' && settings.contact && (
          <ContactSettings data={settings.contact} onChange={(data) => updateSetting('contact', data)} onSave={() => handleSave('contact')} />
        )}
        
        {activeTab === 'footer' && settings.footer && (
          <FooterSettings data={settings.footer} onChange={(data) => updateSetting('footer', data)} onSave={() => handleSave('footer')} />
        )}
      </div>
    </div>
  );
}
