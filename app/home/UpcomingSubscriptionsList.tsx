import UpComingSubscriptionCard from "@/components/cards/UpComingSubscriptionCard";
import List from "@/components/list";
import ListHeading from "@/components/list/ListHeading";
import { UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import React from "react";
import { FlatList, Text } from "react-native";

const UpcomingSubscriptionsList = () => {
  return (
    <List>
      <ListHeading title="Upcoming" />
      <FlatList
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            No upcoming subscriptions
          </Text>
        }
        data={UPCOMING_SUBSCRIPTIONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <UpComingSubscriptionCard data={item} />}
        keyExtractor={(item) => item.id}
      />
    </List>
  );
};

export default UpcomingSubscriptionsList;
