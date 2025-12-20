'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useDeleteFacilityMutation } from '@/feature/RoomAssetApi/facility.api';

type Props = {
  open: boolean;
  onClose: () => void;
  facilityId: string;
  facilityName: string;
  onDeleted: () => void; // callback sau khi xóa thành công
};

export default function FacilityDelete({
  open,
  onClose,
  facilityId,
  facilityName,
  onDeleted,
}: Props) {
  const [deleteFacility, { isLoading }] = useDeleteFacilityMutation();

  const handleConfirmDelete = async () => {
    try {
      await deleteFacility(facilityId).unwrap();
      onClose();
      onDeleted();
    } catch (err) {
      console.error('Delete facility failed', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="font-semibold text-red-600">
        Xác nhận xóa thiết bị
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xóa thiết bị{' '}
          <strong>{facilityName}</strong> không?
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
