import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import {
  SafeAreaView as RNSafeAreaViwe,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
const StyledSafeAreaView = styled(RNSafeAreaViwe);

interface StyledSafeAreaViewProps extends SafeAreaViewProps {
  theme?: "light" | "dark";
}

const SafeAreaView = ({
  children,
  className,
  theme = "light",
  ...rest
}: StyledSafeAreaViewProps) => {
  if (!className) className = "flex-1 bg-background p-5";
  //   TODO: read the status bar style from the global state manager and set it here
  return (
    <StyledSafeAreaView className={className} {...rest}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      {children}
    </StyledSafeAreaView>
  );
};

export default SafeAreaView;
