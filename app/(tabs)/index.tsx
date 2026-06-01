import SafeAreaView from "@/components/SafeAreaView";
import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link
        href="/onBoarding"
        className="mt-4 p-4 text-white bg-primary rounded"
      >
        Go to OnBoarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 p-4 text-white bg-primary rounded"
      >
        Go to Sign In
      </Link>
      <Link
        href={{
          pathname: "/(tabs)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 p-4 text-white bg-primary rounded"
      >
        claude subscription details
      </Link>
    </SafeAreaView>
  );
}
