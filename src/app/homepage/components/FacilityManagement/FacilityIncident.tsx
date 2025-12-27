"use client";

import { useMemo, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import {
  useGetRoomIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
} from "@/feature/RoomAssetApi/incident.api";
import {
  incidentStatusChipSx,
  IncidentStatus,
} from "../RoomManagement/RoomDetails";
import CreateIncidentModal from "../RoomManagement/CreateIncidentModal";
import EditIncidentModal, {
  EditIncidentPayload,
} from "../RoomManagement/EditIncidentModal";
import IncidentDeleteModal from "./DeleteIncident";

export type FacilityIssue = {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  status: IncidentStatus;
  createdBy: string;
};

export type IncidentStatusApi = "pending" | "resolved";

export const mapIncidentStatusFromApi = (
  status?: IncidentStatusApi
): IncidentStatus => {
  switch (status) {
    case "resolved":
      return "Đã xử lý";
    case "pending":
    default:
      return "Chưa xử lý";
  }
};

type Props = {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  roomId: string;
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function FacilityIncident({
  facilityId,
  facilityName,
  facilityType,
  roomId,
  open,
  onClose,
  onCreated,
}: Props) {
  // create incident
  const [createIncident] = useCreateIncidentMutation();

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingIncident, setDeletingIncident] = useState<{
    id: string;
    description: string;
  } | null>(null);

  // upadate
  const [updateIncident, { isLoading: isUpdating }] =
    useUpdateIncidentMutation();

  const [editingIncident, setEditingIncident] = useState<{
    id: string;
    facilityId: string;
    description: string;
    status: IncidentStatus;
    createdBy: string;
  } | null>(null);

  const [openEdit, setOpenEdit] = useState(false);

  // get incident by id room
  const { data: roomIncidents = [] } = useGetRoomIncidentsQuery({
    roomId,
  });

  // nếu user thêm issue mới
  const displayedIssues = useMemo(() => {
    return roomIncidents.map((i) => ({
      id: i.id,
      name: facilityName,
      type: facilityType,
      status: mapIncidentStatusFromApi(i.status),
      description: i.description ?? "",
      createdAt: new Date(i.createdAt).toLocaleString("vi-VN"),
      createdBy: i.created_user.id,
    }));
  }, [roomIncidents, facilityName, facilityType]);

  // table lịch sử hư hỏng

  const columns = useMemo<MRT_ColumnDef<FacilityIssue>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên thiết bị",
        size: 160,
        Cell: ({ cell }) => (
          <span className="font-medium text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 300,
        Cell: ({ cell }) => (
          <span className="text-gray-600">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Thời gian",
        size: 160,
        Cell: ({ cell }) => (
          <span className="text-gray-500">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 160,
        Cell: ({ cell }) => {
          const status = cell.getValue<IncidentStatus>();

          return (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={incidentStatusChipSx(status)}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        size: 120,
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                sx={{ color: "#2563eb" }}
                onClick={() => {
                  setEditingIncident({
                    id: row.original.id,
                    facilityId: facilityId,
                    description: row.original.description,
                    status: row.original.status,
                    createdBy: row.original.createdBy,
                  });
                  setOpenEdit(true);
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa">
              <IconButton
                size="small"
                sx={{ color: "#dc2626" }}
                onClick={() => {
                  setDeletingIncident({
                    id: row.original.id,
                    description: row.original.description,
                  });
                  setOpenDelete(true);
                }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [facilityId]
  );

  const table = useMaterialReactTable({
    columns,
    data: displayedIssues,

    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enablePagination: true,
    enableColumnFilters: false,
    enableGlobalFilter: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        fontWeight: 700,
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "none",
        py: 3,
        px: 3,
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        py: 3,
        px: 3,
        borderBottom: "1px solid #F3F4F6",
      },
    },

    muiTableBodyRowProps: {
      sx: {
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: "#FAFBFC",
        },
        "&:last-child td": {
          borderBottom: "none",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0px",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      density: "comfortable",
    },
    localization: {
      noRecordsToDisplay: "Không có dữ liệu hiển thị",
      rowsPerPage: "Số dòng mỗi trang",
      of: "của",
      goToNextPage: "Trang tiếp",
      goToPreviousPage: "Trang trước",
      goToFirstPage: "Trang đầu",
      goToLastPage: "Trang cuối",
      search: "Tìm kiếm",
    },
  });

  return (
    <>
      {/* bảng lịch sử hư hỏng */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-blue-700">Lịch sử hư hỏng</p>
        </div>

        {displayedIssues.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Chưa có lịch sử hư hỏng
          </div>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>

      {/* tạo incident */}
      <CreateIncidentModal
        open={open}
        onClose={onClose}
        facilities={[{ id: facilityId, name: facilityName }]}
        defaultFacilityId={facilityId}
        onCreated={async (payload) => {
          try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;

            await createIncident({
              description: payload.description,
              room_asset_id: payload.facilityId,
              created_by: user?.id ?? "",
              status: payload.status === "Đã xử lý" ? "resolved" : "pending",
            }).unwrap();

            onCreated?.();
            onClose();
          } catch (e) {
            console.error("Create incident failed", e);
          }
        }}
      />

      {/* chỉnh sửa sự cố */}
      <EditIncidentModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        facilities={[{ id: facilityId, name: facilityName }]}
        incident={editingIncident}
        isSubmitting={isUpdating}
        onUpdated={async (payload: EditIncidentPayload) => {
          try {
            await updateIncident({
              id: payload.id,
              body: {
                description: payload.description,
                room_asset_id: payload.facilityId,
                status: payload.status === "Đã xử lý" ? "resolved" : "pending",
                created_by: editingIncident?.createdBy ?? "",
              },
            }).unwrap();

            setOpenEdit(false);
            setEditingIncident(null);
          } catch (e) {
            console.error("Update incident failed", e);
          }
        }}
      />

      {/* delete sự cố */}
      <IncidentDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeletingIncident(null);
        }}
        incidentId={deletingIncident?.id ?? ""}
        description={deletingIncident?.description}
      />
    </>
  );
}
