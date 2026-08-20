import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home = async () => {
  const cookie = await cookies();
  const token = cookie.has("accessToken");

  if (token) {
    redirect("/dashboard");
  } else {
    redirect(`/login`);
  }
};

export default Home;
