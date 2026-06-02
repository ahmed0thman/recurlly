import { Text, View } from "react-native";

interface AuthBrandProps {
  title: string;
  subtitle: string;
}

const AuthBrand = ({ title, subtitle }: AuthBrandProps) => (
  <View className="auth-brand-block">
    <View className="auth-logo-wrap">
      <View className="auth-logo-mark">
        <Text className="auth-logo-mark-text">R</Text>
      </View>
      <View>
        <Text className="auth-wordmark">Recurly</Text>
        <Text className="auth-wordmark-sub">Smart billing</Text>
      </View>
    </View>
    <Text className="auth-title">{title}</Text>
    <Text className="auth-subtitle">{subtitle}</Text>
  </View>
);

export default AuthBrand;
