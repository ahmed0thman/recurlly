import AuthBrand from "@/components/auth/AuthBrand";
import AuthButton from "@/components/auth/AuthButton";
import AuthFormField from "@/components/auth/AuthFormField";
import AuthLinkRow from "@/components/auth/AuthLinkRow";
import AuthPageLayout, { AuthLoading } from "@/components/auth/AuthPageLayout";
import { useSignUp } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type FieldErrors = {
  email?: string;
  password?: string;
  code?: string;
  general?: string;
};

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isBusy = fetchStatus === "fetching";

  const clerkErrors = useMemo(() => {
    return {
      emailAddress: errors?.fields?.emailAddress?.message,
      password: errors?.fields?.password?.message,
      code: errors?.fields?.code?.message,
      general: errors?.global?.[0]?.message,
    };
  }, [errors]);

  const navigateAfterAuth = async () => {
    if (!signUp) return;
    const { error } = await signUp.finalize();
    if (!error) {
      router.replace("/" as Href);
    }
  };

  const validateCredentials = () => {
    const nextErrors: FieldErrors = {};
    const emailResult = emailSchema.safeParse(emailAddress);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success) {
      nextErrors.email = emailResult.error.issues[0]?.message;
    }
    if (!passwordResult.success) {
      nextErrors.password = passwordResult.error.issues[0]?.message;
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setFieldErrors({});
    if (!validateCredentials() || !signUp) return;

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFieldErrors({ general: "We couldn't create your account yet." });
      return;
    }

    if (signUp.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    setFieldErrors({});
    if (!signUp) return;

    if (!code.trim()) {
      setFieldErrors({ code: "Enter the verification code" });
      return;
    }

    await signUp.verifications.verifyEmailCode({ code: code.trim() });

    if (signUp.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    setFieldErrors({
      general: "We couldn't verify that code. Please try again.",
    });
  };

  const isEmailVerificationStep =
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (!signUp) {
    return <AuthLoading />;
  }

  if (isEmailVerificationStep) {
    return (
      <AuthPageLayout>
        <AuthBrand
          title="Verify your email"
          subtitle={`We sent a 6-digit code to ${emailAddress.trim() || "your email"}.`}
        />
        <View className="auth-card">
          <View className="auth-form">
            <AuthFormField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              placeholder="Enter the 6-digit code"
              error={fieldErrors.code || clerkErrors.code}
            />

            {fieldErrors.general || clerkErrors.general ? (
              <Text className="auth-error">
                {fieldErrors.general || clerkErrors.general}
              </Text>
            ) : null}

            <AuthButton
              label="Verify"
              onPress={handleVerify}
              loading={isBusy}
            />
            <AuthButton
              label="Resend code"
              variant="secondary"
              onPress={() => signUp.verifications.sendEmailCode()}
            />
          </View>
        </View>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthBrand
        title="Create your account"
        subtitle="Join in minutes and stay ahead of every renewal with clear subscription tracking."
      />
      <View className="auth-card">
        <View className="auth-form">
          <AuthFormField
            label="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="username"
            textContentType="username"
            placeholder="Enter your email"
            error={fieldErrors.email || clerkErrors.emailAddress}
          />

          <AuthFormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="Create a password"
            error={fieldErrors.password || clerkErrors.password}
          />

          {fieldErrors.general || clerkErrors.general ? (
            <Text className="auth-error">
              {fieldErrors.general || clerkErrors.general}
            </Text>
          ) : null}

          <AuthButton
            label="Create account"
            onPress={handleSubmit}
            loading={isBusy}
          />

          <Text className="auth-helper text-center">
            By continuing, you agree to our Terms and acknowledge the Privacy
            Policy.
          </Text>
        </View>
      </View>

      <AuthLinkRow
        question="Already have an account?"
        linkLabel="Sign in"
        href="/(auth)/sign-in"
      />

      <View nativeID="clerk-captcha" />
    </AuthPageLayout>
  );
};

export default SignUp;
