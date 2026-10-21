import React from 'react';
import { Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  Applied: {
    icon: Clock,
    label: 'Applied',
    className: 'badge-Applied'
  },
  Interview: {
    icon: Calendar,
    label: 'Interview',
    className: 'badge-Interview'
  },
  Offer: {
    icon: CheckCircle2,
    label: 'Offer',
    className: 'badge-Offer'
  },
  Rejected: {
    icon: XCircle,
    label: 'Rejected',
    className: 'badge-Rejected'
  }
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.Applied;
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}
