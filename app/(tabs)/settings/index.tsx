import { useAuth, useUser } from "@clerk/expo";
import SafeAreaView from "@/components/layout/SafeAreaView";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <SafeAreaView>
      <ScrollView contentContainerClassName="pb-20">
        <Text className="mb-6 text-3xl font-sans-bold text-primary">
          Settings
        </Text>

        <View className="mb-8 items-center gap-3">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="size-24 rounded-full"
            />
          ) : (
            <View className="size-24 items-center justify-center rounded-full bg-accent">
              <Text className="text-3xl font-sans-bold text-background">
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="text-2xl font-sans-bold text-primary">
            {user?.fullName}
          </Text>
          <Text className="text-base font-sans-medium text-muted-foreground">
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
        </View>

        <View className="gap-4 rounded-3xl border border-border bg-card p-5">
          <InfoRow label="Account ID" value={user?.id} />
          <View className="h-px bg-border" />
          <InfoRow label="Joined" value={joinedDate} />
        </View>

        <TouchableOpacity
          onPress={() => signOut()}
          className="mt-8 items-center rounded-2xl bg-destructive py-4"
        >
          <Text className="text-base font-sans-bold text-background">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View>
    <Text className="text-sm font-sans-semibold text-muted-foreground">
      {label}
    </Text>
    <Text className="mt-1 text-base font-sans-bold text-primary">
      {value}
    </Text>
  </View>
);

export default Settings;
