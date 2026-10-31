/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  MessageSquare,
  Share2,
  Globe,
  Music,
  Play,
  Video,
  Smartphone,
  Wifi,
} from 'lucide-react';

interface ActivityIconProps {
  name: string;
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Compass':
      return <Compass className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'Share2':
      return <Share2 className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Play':
      return <Play className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    default:
      return <Globe className={className} />;
  }
};
