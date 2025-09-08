'use client';

import { CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth.store';
import { IUser } from '@/types/user.type';
import { capitalize } from 'lodash';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import UpdatePasswordModal from '../auth/update-password-modal';
import EditUserDialog from '../shared/user-edit-dialog';

export const SidebarUserMenu = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { isMobile } = useSidebar();
  const { user, signOutApp } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      signOutApp: state.signOutApp,
    })),
  );

  const openEdit = () => {
    setOpenDropdown(false);
    setOpenEditDialog(true);
  };
  const openEditPassword = () => {
    setOpenDropdown(false);
    setOpenPasswordModal(true);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem className='cursor-pointer shadow-lg'>
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg'>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {(user?.firstName?.[0] ?? '').toUpperCase() +
                    (user?.lastName?.[0] ?? '').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {capitalize(user?.firstName) + ' ' + capitalize(user?.lastName)}
                </span>
              </div>
              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {(user?.firstName?.[0] ?? '').toUpperCase() +
                      (user?.lastName?.[0] ?? '').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {capitalize(user?.firstName) + capitalize(user?.lastName)}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {capitalize(user?.role)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openEdit()}>
                <UserCircleIcon />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEditPassword}>
                <CreditCardIcon />
                Edit Password
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push(ROUTES.NOTIFICATIONS)}
                className='cursor-pointer'
              >
                <BellIcon />
                <span className='flex items-center justify-between w-full gap-2'>
                  Notifications
                  {!isUnreadLoading && <Badge>{unreadCount}</Badge>}
                </span>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              <button className='w-full text-start' onClick={signOutApp}>
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {openEditDialog && (
          <EditUserDialog
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            userData={user as IUser}
          />
        )}
        {openPasswordModal && (
          <UpdatePasswordModal open={openPasswordModal} setOpen={setOpenPasswordModal} />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
