'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useDeleteUserMutation } from '@/feature/UserApi/user.api';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  onDeleted: () => void;
};

export default function UserDelete({
  open,
  onClose,
  userId,
  username,
  onDeleted,
}: Props) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      onClose();
      onDeleted();
    } catch (err) {
      console.error('Delete user failed', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="font-semibold text-red-600">
        Xác nhận xóa người dùng
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xóa người dùng{' '}
          <strong>{username}</strong> không?
        </DialogContentText>
      </DialogContent>

      <DialogActions className="px-6 pb-4">
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirmDelete}
          disabled={isLoading}
          className="bg-[#5295f8] hover:bg-[#377be1]"
        >
          {isLoading ? 'Đang xóa...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
