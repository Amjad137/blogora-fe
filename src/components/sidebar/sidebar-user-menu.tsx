'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useState } from 'react';
import UserAvatarDropdown from './user-avatar-dropdown';

export const SidebarUserMenu = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem className='cursor-pointer shadow-lg'>
        <UserAvatarDropdown openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
