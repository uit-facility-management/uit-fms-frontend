import { Box, Button } from "@mui/material";
import UserDetail from "./UserDetail";
import UserSchedule from "./UserSchedule";

export default function PersonalComponent({
  userId,
  onBack,
}: {
  userId: string;
  onBack: () => void;
}) {
  return (
    <>
      <UserDetail
        userId={userId}
        onBack={onBack}
        showDelete={false} />
        
      <UserSchedule userId={userId} />
    </>
  );
}
