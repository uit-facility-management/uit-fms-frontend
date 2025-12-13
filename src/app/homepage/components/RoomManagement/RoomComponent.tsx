'use client';

export default function RoomComponent() {
  const handleCreateRoom = () => {
    console.log('Tạo phòng');
  };

  const handleBookRoom = () => {
    console.log('Đặt phòng');
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-end gap-2">
        <button
          onClick={handleCreateRoom}
          className="rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
        >
          + Tạo phòng
        </button>

        <button
          onClick={handleBookRoom}
          className="rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
        >
          + Đặt phòng
        </button>
      </div>
    </div>
  );
}
