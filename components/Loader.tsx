
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LOADERS, LoaderKey } from './loaders';

const Loader: React.FC = () => {
  const { settings } = useSettings();
  
  // Lấy key từ settings, mặc định là 'default' nếu chưa set hoặc không tồn tại
  const activeKey = (settings.active_loader || 'default') as LoaderKey;
  
  // Fallback về default nếu key trong DB không khớp với Registry
  const ActiveLoaderComponent = LOADERS[activeKey]?.component || LOADERS['default'].component;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ActiveLoaderComponent />
    </div>
  );
};

export default Loader;
