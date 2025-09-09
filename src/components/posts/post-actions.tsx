'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostResponseDTO } from '@/dto/post.dto';
import { useState } from 'react';
import CreatePostDialog from './create-post-dialog';
import { useDeletePost } from '@/hooks/use-post';

interface PostActionsProps {
  post: PostResponseDTO;
}

export const PostActions = ({ post }: PostActionsProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { mutate: deletePost, isPending } = useDeletePost();

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreVertical className='h-4 w-4' />
            <span className='sr-only'>Open post actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => {
              setOpenDropdown(false);
              setOpenEditDialog(true);
            }}
          >
            <Pencil className='h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenDropdown(false);
              setConfirmOpen(true);
            }}
          >
            <Trash2 className='h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openEditDialog && (
        <CreatePostDialog editPost={post} open={openEditDialog} setOpen={setOpenEditDialog}>
          <span />
        </CreatePostDialog>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            This action cannot be undone. This will permanently delete this post.
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                deletePost(
                  { postId: post._id },
                  {
                    onSuccess: () => setConfirmOpen(false),
                  },
                );
              }}
              loading={isPending}
              disabled={isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostActions;
