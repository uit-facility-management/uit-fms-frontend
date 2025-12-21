'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useDeleteIncidentMutation } from '@/feature/RoomAssetApi/incident.api';

type Props = {
  open: boolean;
  onClose: () => void;
  incidentId: string;
  description?: string;
};

export default function IncidentDeleteModal({
  open,
  onClose,
  incidentId,
  description,
}: Props) {
  const [deleteIncident, { isLoading }] = useDeleteIncidentMutation();

  const handleConfirmDelete = async () => {
    try {
      await deleteIncident({ id: incidentId }).unwrap();
      onClose(); // đóng modal
    } catch (err) {
      console.error('Delete incident failed', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="font-semibold text-red-600">
        Xác nhận xóa ghi chú sự cố
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xóa ghi chú sự cố:
          {description && (
            <>
              {' '}
              <strong>{description}</strong>
            </>
          )}{' '}
          không?
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
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? 'Đang xóa...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
