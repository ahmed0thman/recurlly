import SafeAreaView from "@/components/layout/SafeAreaView";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const AuthLoading = () => (
  <SafeAreaView className="auth-safe-area">
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  </SafeAreaView>
);

export default AuthPageLayout;
