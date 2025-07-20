import { Redirect } from "expo-router";
import "@/global.css";

const index = () => {
  return <Redirect href="/(auth)/onboarding" />;
};


export default index;
