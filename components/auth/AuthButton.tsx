import { ActivityIndicator, Pressable, Text } from "react-native";

interface AuthButtonProps {
  onPress: () => void;
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

const AuthButton = ({ onPress, label, loading, variant = "primary" }: AuthButtonProps) => {
  if (variant === "secondary") {
    return (
      <Pressable className="auth-secondary-button" onPress={onPress}>
        <Text className="auth-secondary-button-text">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      className={loading ? "auth-button auth-button-disabled" : "auth-button"}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className="auth-button-text text-background">{label}</Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
