import { Text, TextInput, TextInputProps, View } from "react-native";

interface AuthFormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

const AuthFormField = ({
  label,
  error,
  className,
  ...inputProps
}: AuthFormFieldProps) => (
  <View className="auth-field">
    <Text className="auth-label">{label}</Text>
    <TextInput
      placeholderTextColor="rgba(0, 0, 0, 0.4)"
      className={`${error ? "auth-input auth-input-error" : "auth-input"} ${className ?? ""}`}
      {...inputProps}
    />
    {error && <Text className="auth-error">{error}</Text>}
  </View>
);

export default AuthFormField;
