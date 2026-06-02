import { Link, type Href } from "expo-router";
import { Text, View } from "react-native";

interface AuthLinkRowProps {
  question: string;
  linkLabel: string;
  href: Href;
}

const AuthLinkRow = ({ question, linkLabel, href }: AuthLinkRowProps) => (
  <View className="auth-link-row">
    <Text className="auth-link-copy">{question}</Text>
    <Link href={href}>
      <Text className="auth-link">{linkLabel}</Text>
    </Link>
  </View>
);

export default AuthLinkRow;
