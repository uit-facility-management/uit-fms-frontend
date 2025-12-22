import { Check, X } from "lucide-react";

type BorrowStatus = "BORROWING" | "RETURNED";

interface BorrowRequest {
  id: string;
  borrowed_at: string;
  returned_at: string | null;
  status: BorrowStatus;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
  };
  room: {
    id: string;
    name: string;
    status: string;
    stage: number;
    type: string;
    capacity: number;
  };
  device: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  student: {
    id: string;
    student_code: number;
    name: string;
    entry_year: number;
  };
}

export default function BorrowRequestsTab() {
  const borrowRequests: BorrowRequest[] = [
    {
      id: "6261b020-b7f2-4b33-8bfe-f8b4c1dc1996",
      borrowed_at: "2025-12-22T13:36:39.551Z",
      returned_at: null,
      status: "BORROWING",
      created_at: "2025-12-22T13:36:39.551Z",
      updated_at: "2025-12-22T13:36:39.551Z",
      user: {
        id: "ebae473a-1a93-4969-b481-533f267db64b",
        email: "22520604@gm.uit.edu.vn",
        username: "khi",
        fullName: "Nguyễn Quang Khải",
        role: "admin",
      },
      room: {
        id: "fa819163-964a-4a63-9fd3-8814c86631e1",
        name: "Conference Room ABC",
        status: "active",
        stage: 3,
        type: "meeting",
        capacity: 10,
      },
      device: {
        id: "19a8f165-b4d6-412b-978e-fd44cd086c36",
        name: "Microphone 1",
        description: "High-quality microphone for clear audio recording",
        status: "INACTIVE",
      },
      student: {
        id: "eb67b10e-0f7e-487d-8adb-176a607b2dd3",
        student_code: 22520001,
        name: "Nguyen Van A",
        entry_year: 2022,
      },
    },
    {
      id: "7372c131-c8g3-5c44-9cgf-g9c5d2ed2007",
      borrowed_at: "2025-12-20T10:20:15.441Z",
      returned_at: "2025-12-21T14:30:20.551Z",
      status: "RETURNED",
      created_at: "2025-12-20T10:20:15.441Z",
      updated_at: "2025-12-21T14:30:20.551Z",
      user: {
        id: "user-002",
        email: "admin@example.com",
        username: "admin",
        fullName: "Admin User",
        role: "admin",
      },
      room: {
        id: "room-002",
        name: "Lab Room 101",
        status: "active",
        stage: 2,
        type: "lab",
        capacity: 25,
      },
      device: {
        id: "device-002",
        name: "Laptop Dell",
        description: "Dell Latitude 5420",
        status: "ACTIVE",
      },
      student: {
        id: "student-002",
        student_code: 22520002,
        name: "Tran Thi B",
        entry_year: 2022,
      },
    },
    {
      id: "8483d242-d9h4-6d55-0dh0-h0d6e3fe3118",
      borrowed_at: "2025-12-21T08:15:30.331Z",
      returned_at: null,
      status: "BORROWING",
      created_at: "2025-12-21T08:15:30.331Z",
      updated_at: "2025-12-21T08:15:30.331Z",
      user: {
        id: "user-003",
        email: "staff@example.com",
        username: "staff",
        fullName: "Staff User",
        role: "staff",
      },
      room: {
        id: "room-003",
        name: "Meeting Room A",
        status: "active",
        stage: 1,
        type: "meeting",
        capacity: 15,
      },
      device: {
        id: "device-003",
        name: "Projector Epson",
        description: "Epson EB-X41",
        status: "INACTIVE",
      },
      student: {
        id: "student-003",
        student_code: 22520003,
        name: "Le Van C",
        entry_year: 2022,
      },
    },
  ];

  const handleReturn = (id: string) => {
    console.log("Xác nhận trả:", id);
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
                    className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
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