import { View, Text } from "react-native";
import React from "react";
import ListHeading from "./ListHeading";

interface ListProps {
  children?: React.ReactNode;
  className?: string;
}
const List = ({ children, className }: ListProps) => {
  return <View className={className}>{children}</View>;
};

export default List;
