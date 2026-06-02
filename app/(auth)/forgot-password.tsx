import AuthBrand from "@/components/auth/AuthBrand";
import AuthButton from "@/components/auth/AuthButton";
import AuthFormField from "@/components/auth/AuthFormField";
import AuthLinkRow from "@/components/auth/AuthLinkRow";
import AuthPageLayout, { AuthLoading } from "@/components/auth/AuthPageLayout";
import { useSignIn } from "@clerk/expo";
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

const ForgotPassword = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isBusy = fetchStatus === "fetching";

  const clerkErrors = useMemo(() => {
    return {
      identifier: errors?.fields?.identifier?.message,
      code: errors?.fields?.code?.message,
      password: errors?.fields?.password?.message,
      general: errors?.global?.[0]?.message,
    };
  }, [errors]);

  const navigateAfterAuth = async () => {
    if (!signIn) return;
    const { error } = await signIn.finalize();
    if (!error) {
      router.replace("/" as Href);
    }
  };

  const handleSendCode = async () => {
    setFieldErrors({});
    if (!signIn) return;

    const emailResult = emailSchema.safeParse(emailAddress);
    if (!emailResult.success) {
      setFieldErrors({ email: emailResult.error.issues[0]?.message });
      return;
    }

    const { error: createError } = await signIn.create({
      identifier: emailAddress.trim(),
    });
    if (createError) {
      setFieldErrors({ general: "We couldn't find that account." });
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();
    if (sendCodeError) {
      setFieldErrors({
        general: "Failed to send the reset code. Try again.",
      });
      return;
    }

    setCodeSent(true);
  };

  const handleVerifyCode = async () => {
    setFieldErrors({});
    if (!signIn) return;

    if (!code.trim()) {
      setFieldErrors({ code: "Enter the verification code" });
      return;
    }

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({
      code: code.trim(),
    });
    if (error) {
      setFieldErrors({
        code: "That code didn't work. Please try again.",
      });
      return;
    }
  };

  const handleResetPassword = async () => {
    setFieldErrors({});
    if (!signIn) return;

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setFieldErrors({ password: passwordResult.error.issues[0]?.message });
      return;
    }

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (error) {
      setFieldErrors({
        general: "We couldn't reset your password. Try again.",
      });
      return;
    }

    if (signIn.status === "complete") {
      await navigateAfterAuth();
      return;
    }
  };

  if (!signIn) {
    return <AuthLoading />;
  }

  const showCodeVerification =
    codeSent && signIn.status !== "needs_new_password";
  const showNewPassword = signIn.status === "needs_new_password";

  return (
    <AuthPageLayout>
      <AuthBrand
        title={showNewPassword ? "Set new password" : "Reset your password"}
        subtitle={
          showNewPassword
            ? "Choose a strong password you haven't used before."
            : showCodeVerification
              ? `We sent a 6-digit code to ${emailAddress.trim() || "your email"}.`
              : "Enter your email and we'll send you a reset code."
        }
      />
      <View className="auth-card">
        <View className="auth-form">
          {!codeSent && !showNewPassword ? (
            <AuthFormField
              label="Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="username"
              textContentType="username"
              placeholder="Enter your email"
              error={fieldErrors.email || clerkErrors.identifier}
            />
          ) : null}

          {showCodeVerification ? (
            <AuthFormField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              placeholder="Enter the 6-digit code"
              error={fieldErrors.code || clerkErrors.code}
            />
          ) : null}

          {showNewPassword ? (
            <AuthFormField
              label="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Enter your new password"
              error={fieldErrors.password || clerkErrors.password}
            />
          ) : null}

          {fieldErrors.general || clerkErrors.general ? (
            <Text className="auth-error">
              {fieldErrors.general || clerkErrors.general}
            </Text>
          ) : null}

          {showCodeVerification ? (
            <>
              <AuthButton label="Verify" onPress={handleVerifyCode} loading={isBusy} />
              <AuthButton
                label="Resend code"
                variant="secondary"
                onPress={() => signIn.resetPasswordEmailCode.sendCode()}
              />
            </>
          ) : showNewPassword ? (
            <AuthButton label="Reset password" onPress={handleResetPassword} loading={isBusy} />
          ) : (
            <AuthButton label="Send reset code" onPress={handleSendCode} loading={isBusy} />
          )}
        </View>
      </View>

      <AuthLinkRow
        question="Remember your password?"
        linkLabel="Sign in"
        href="/(auth)/sign-in"
      />
    </AuthPageLayout>
  );
};

export default ForgotPassword;
