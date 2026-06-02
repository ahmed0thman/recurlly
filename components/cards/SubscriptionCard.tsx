import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import { clsx } from "clsx";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  paymentMethod,
  startDate,
  status,
  expanded,
  onPress,
}: SubscriptionCardProps) => {
  const cardMetaText =
    category?.trim() ||
    plan?.trim() ||
    (renewalDate ? formatSubscriptionDateTime(renewalDate) : "");

  const expandedRows = [
    { label: "Payment Method", value: paymentMethod?.trim() },
    {
      label: "Category",
      value: category?.trim() || plan?.trim(),
    },
    {
      label: "Started",
      value: startDate ? formatSubscriptionDateTime(startDate) : "",
    },
    {
      label: "Renewal Date",
      value: renewalDate ? formatSubscriptionDateTime(renewalDate) : "",
    },
    {
      label: "Status",
      value: status?.trim() ? formatStatusLabel(status) : "",
    },
  ].filter((row) => row.value);
  return (
    <Pressable
      className={clsx("sub-card", "bg-card", expanded && "expanded")}
      style={{ backgroundColor: color ? color : undefined }}
      onPress={onPress}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text className="sub-title" numberOfLines={1}>
              {name}
            </Text>
            <Text className="sub-meta" numberOfLines={1} ellipsizeMode="tail">
              {cardMetaText}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            {expandedRows.map((row) => (
              <View key={row.label} className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">{row.label}</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
