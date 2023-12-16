import React from 'react';
import { Avatar } from 'react-daisyui';
import { stringToRandomHueHex } from '../utils/color.utils';

export interface ListTileProps {
  title: string;
  subtitle?: React.ReactNode | string;
  badge?: React.ReactNode;
  avatarName?: string;
  active?: boolean;
  onClick?: () => void;
}

const ListTile: React.FC<ListTileProps> = (props) => {
  const { title, active, subtitle, avatarName, badge, onClick } = props;

  return (
    <div
      className={`flex items-center gap-2 p-2 ${
        onClick ? 'cursor-pointer hover:bg-slate-900/20' : ''
      } ${active ? 'bg-slate-900/30' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {avatarName && (
          <Avatar
            size="xs"
            className="rounded-full bg-slate-500 font-medium"
            style={{ backgroundColor: stringToRandomHueHex(avatarName) }}
            children={<h1>{avatarName[0]}</h1>}
          />
        )}
        {badge && (
          <div className="absolute bottom-[0.08rem] right-[0.08rem]">
            {badge}
          </div>
        )}
      </div>
      <div className="flex grow flex-col items-start gap-1">
        <h6 className="truncate">{title}</h6>
        {subtitle && typeof subtitle === 'string' && (
          <p className="truncate text-xs">{subtitle}</p>
        )}
        {subtitle && typeof subtitle !== 'string' && subtitle}
      </div>
    </div>
  );
};

export default ListTile;
