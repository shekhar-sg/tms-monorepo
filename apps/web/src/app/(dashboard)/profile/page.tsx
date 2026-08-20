import ProfileForm from "@/components/dashboard/profile/profile-form";
import { getCurrentUser } from "@/lib/api/auth-api";
import { serverApi } from "@/lib/api/server-api";

const ProfilePage = async () => {
  const api = await serverApi();
  const user = await getCurrentUser(api);

  return <ProfileForm user={user} />;
};

export default ProfilePage;
