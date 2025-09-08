/* eslint-disable sonarjs/no-nested-conditional */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { IUser } from '@/types/user.type';
import { ColumnDef, FilterFn } from '@tanstack/react-table';
import UsersActionsDropdown from './table-action-components/users-actions-dropdown';

const multiColumnFilterFn: FilterFn<IUser> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.email} ${row.original.firstName} ${row.original.lastName}`;
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const usersTableColumns: ColumnDef<IUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='User ID' />;
    },
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Full Name' />;
    },
    cell: ({ row }) => {
      const fullName = `${row.original.firstName} ${row.original.lastName}`.trim();
      return (
        <div className='flex items-center gap-2 text-xs font-normal text-left max-w-[200px] break-words text-foreground'>
          <Avatar>
            <AvatarImage src={row.original.profilePicUrl} className='object-cover' />
            <AvatarFallback>
              {row.original.firstName?.charAt(0).toUpperCase() +
                row.original.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='break-words'>{fullName}</span>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='User Email' />;
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'phoneNo',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Phone Number' />;
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Address' />;
    },
    cell: ({ row }) => {
      return (
        <div className='flex flex-wrap items-center gap-2 text-xs font-normal text-left max-w-[200px] break-words'>
          {row.original.address.line1}
          {row.original.address.line2 && `, ${row.original.address.line2}`}
          {`, ${row.original.address.city}`}
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Active' />;
    },
    cell: ({ row }) => {
      return (
        <Badge
          className='font-medium w-14 justify-center'
          variant={`${row.getValue('isActive') ? 'default' : 'destructive'}`}
        >
          {String(row.getValue('isActive'))}
        </Badge>
      );
    },
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: 'selectedRowsAndActions',
    header: ({ table }) => {
      const noOfSelectedRows = table.getSelectedRowModel().rows.length;
      return (
        <div className='flex items-center w-full gap-2'>
          <span className='flex justify-end text-muted-foreground w-full text-xs text-end'>
            {noOfSelectedRows} Selected
          </span>
        </div>
      );
    },
    cell: ({ row }) => {
      return <UsersActionsDropdown rowData={row.original} />;
    },
  },
];
