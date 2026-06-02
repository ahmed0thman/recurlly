import SafeAreaView from "@/components/layout/SafeAreaView";
import ListHeading from "@/components/list/ListHeading";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import "@/global.css";
import { FlatList, Text, View } from "react-native";
import BalanceCard from "../home/BalanceCard";
import HomeHeader from "../home/HomeHeader";
import SubscriptionCard from "@/components/cards/SubscriptionCard";
import { useState } from "react";
import UpcomingSubscriptionsList from "../home/UpcomingSubscriptionsList";

export default function App() {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={
          <>
            <View className="mb-5">
              <HomeHeader />
              <BalanceCard />
              <UpcomingSubscriptionsList />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            No subscriptions
          </Text>
        }
        data={HOME_SUBSCRIPTIONS}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubId === item.id}
            onPress={() =>
              setExpandedSubId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
