import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
const SubscriptionDetails = () => {
  const { id: subscriptionId } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details: {subscriptionId}</Text>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default SubscriptionDetails;
