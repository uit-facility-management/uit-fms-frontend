import { Check } from "lucide-react";
import {
  useGetAllBorrowTicketsQuery,
  useReturnBorrowTicketMutation,
} from "@/feature/ToolsApi/borrow.api";

type BorrowStatus = "BORROWING" | "RETURNED";

// interface BorrowRequest {
//   id: string;
//   borrowed_at: string;
//   returned_at: string | null;
//   status: BorrowStatus;
//   created_at: string;
//   updated_at: string;
//   user: {
//     id: string;
//     email: string;
//     username: string;
//     fullName: string;
//     role: string;
//   };
//   room: {
//     id: string;
//     name: string;
//     status: string;
//     stage: number;
//     type: string;
//     capacity: number;
//   };
//   device: {
//     id: string;
//     name: string;
//     description: string;
//     status: string;
//   };
//   student: {
//     id: string;
//     student_code: number;
//     name: string;
//     entry_year: number;
//   };
// }

export default function BorrowRequestsTab() {
  // get all phieu muon
  const {
    data: borrowRequests = [],
    isLoading,
    isError,
  } = useGetAllBorrowTicketsQuery();

  // duyet phieu muon
  const [returnBorrowTicket, { isLoading: isReturning }] =
    useReturnBorrowTicketMutation();

  // handle duyet phieu mượn
  const handleReturn = async (id: string) => {
    try {
      await returnBorrowTicket(id).unwrap();
      // không cần refetch – RTK Query auto reload nhờ invalidatesTags
    } catch (error) {
      console.error("Xác nhận trả thất bại", error);
      alert("Không thể xác nhận trả thiết bị");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: BorrowStatus) => {
    const styles = {
      BORROWING: "bg-blue-100 text-blue-700 border-blue-200",
      RETURNED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const labels = {
      BORROWING: "Đang mượn",
      RETURNED: "Đã trả",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Đang tải danh sách mượn thiết bị...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        Không thể tải dữ liệu mượn thiết bị
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Thiết bị
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Sinh viên
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Ngày mượn
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Trạng thái
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {borrowRequests.map((borrow) => (
            <tr
              key={borrow.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="font-semibold text-gray-900">
                  {borrow.device.name}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700">{borrow.student.name}</td>
              <td className="py-4 px-4 text-gray-700">
                {formatDate(borrow.borrowed_at)}
              </td>
              <td className="py-4 px-4">{getStatusBadge(borrow.status)}</td>
              <td className="py-4 px-4">
                {borrow.status === "BORROWING" ? (
                  <button
                    onClick={() => handleReturn(borrow.id)}
                    disabled={isReturning}
                    className="p-1.5 bg-green-100 hover:bg-green-200 disabled:opacity-50 text-green-700 rounded-lg transition-colors"
                    title="Xác nhận trả"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">Đã xử lý</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
