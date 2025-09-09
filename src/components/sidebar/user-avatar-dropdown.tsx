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
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';
import {
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  FileTextIcon,
} from 'lucide-react';
import { capitalize } from 'lodash';
import { useAuthStore } from '@/stores/auth.store';
import { useShallow } from 'zustand/react/shallow';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditUserDialog from '../shared/user-edit-dialog';
import UpdatePasswordModal from '../auth/update-password-modal';
import { getUserInitials } from '@/utils/user-utils';
import { ROUTES } from '@/constants/routes.constants';

type Props = {
  openDropdown: boolean;
  setOpenDropdown: (open: boolean) => void;
  userHeader?: boolean;
};

const UserAvatarDropdown = ({ openDropdown, setOpenDropdown, userHeader = false }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const router = useRouter();

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

  const navigateToDashboard = () => {
    setOpenDropdown(false);
    router.push(ROUTES.DASHBOARD);
  };
  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          {userHeader ? (
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
          ) : (
            <SidebarMenuButton size='lg'>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>

              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {capitalize(user?.firstName) + ' ' + capitalize(user?.lastName)}
                </span>
              </div>

              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
          side={isMobile || userHeader ? 'bottom' : 'right'}
          align='end'
          sideOffset={4}
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
              {/* <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {(user?.firstName?.[0] ?? '').toUpperCase() +
                    (user?.lastName?.[0] ?? '').toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {capitalize(user?.firstName) + ' ' + capitalize(user?.lastName)}
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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={navigateToDashboard}>
              <FileTextIcon />
              Dashboard
            </DropdownMenuItem>
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
      {openEditDialog && user && (
        <EditUserDialog open={openEditDialog} setOpen={setOpenEditDialog} userData={user} />
      )}
      {openPasswordModal && (
        <UpdatePasswordModal open={openPasswordModal} setOpen={setOpenPasswordModal} />
      )}
    </>
  );
};

export default UserAvatarDropdown;
