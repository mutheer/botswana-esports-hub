import Layout from "@/components/layout/Layout";
import UserProfileManager from "@/components/user/UserProfileManager";

const Profile = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <UserProfileManager />
      </div>
    </Layout>
  );
};

export default Profile;