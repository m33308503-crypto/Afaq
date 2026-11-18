import React from 'react';

export interface AdminSectionPlaceholderProps {
  title: string;
}

export const AdminSectionPlaceholder: React.FC<AdminSectionPlaceholderProps> = ({
  title,
}) => {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#123B5D]">
          {title}
        </h1>
      </div>
    </div>
  );
};
