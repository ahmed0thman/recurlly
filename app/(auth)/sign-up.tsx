import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-in">
        <Text>Already have an account? Sign In</Text>
      </Link>
    </View>
  );
};

export default SignUp;
