import { Redirect } from "expo-router";
import "@/global.css";

const index = () => {
  return <Redirect href="/(seller_dashboard)/SellerDashboard" />;
};

export default index;
