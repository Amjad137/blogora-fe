import { useVerifyUsers } from '@/hooks/use-users';
import { IUser } from '@/types/user.type';
import { Table } from '@tanstack/react-table';
import { Ban, Check } from 'lucide-react';
import { UpdateEntityStatus } from '../../ui/data-table/update-entity-status-dropdown';

type Props<TData> = {
  table: Table<TData>;
  currentVerification?: string;
};

const UsersActionComponents = <TData,>({ table, currentVerification }: Props<TData>) => {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const selectedNames = table
    .getSelectedRowModel()
    .rows.map(
      (row) =>
        String(row.getValue('firstName') + ' ' + (row.original as IUser).lastName) +
        ` (${row.getValue('userName')})`,
    );
  const selectedIDs = table.getSelectedRowModel().rows.map((row) => String(row.getValue('_id')));

  const { mutateAsync: verifyMultipleUsers, isPending: verifyLoading } = useVerifyUsers();

  const handleUsersVerification = async (verification: string) => {
    await verifyMultipleUsers({ userIDs: selectedIDs, verification });
  };

  const verifyActions = [
    {
      label: 'Mark verified',
      value: 'true',
      icon: <Check className='w-4 h-4 mr-2 text-green-500' />,
    },
    {
      label: 'Mark non-verified',
      value: 'false',
      icon: <Ban className='w-4 h-4 mr-2 text-red-700' />,
    },
  ];

  return (
    <div className='flex flex-wrap gap-3'>
      <UpdateEntityStatus
        table={table}
        updateCallback={handleUsersVerification}
        selectedCount={selectedCount}
        selectedNames={selectedNames}
        isPending={verifyLoading}
        actions={verifyActions}
        buttonText='Update Verification'
        currentValue={currentVerification}
        entityType='users'
      />
    </div>
  );
};

export default UsersActionComponents;
