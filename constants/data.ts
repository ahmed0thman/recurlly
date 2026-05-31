import { ImageSourcePropType } from "react-native";
import { IconKey, icons } from "./icons";

interface Tab {
  name: string;
  title: string;
  icon: ImageSourcePropType;
}
export const tabs: Tab[] = [
  { name: "index", title: "Home", icon: icons.home },
  {
    name: "subscriptions",
    title: "Subscriptions",
    icon: icons.wallet,
  },
  {
    name: "insights",
    title: "Insights",
    icon: icons.activity,
  },
  {
    name: "settings",
    title: "Settings",
    icon: icons.setting,
  },
];
