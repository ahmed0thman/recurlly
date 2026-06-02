import AuthBrand from "@/components/auth/AuthBrand";
import AuthButton from "@/components/auth/AuthButton";
import AuthFormField from "@/components/auth/AuthFormField";
import AuthLinkRow from "@/components/auth/AuthLinkRow";
import AuthPageLayout, { AuthLoading } from "@/components/auth/AuthPageLayout";
import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
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

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isBusy = fetchStatus === "fetching";
  const emailCodeFactor = signIn?.supportedSecondFactors?.find(
    (factor) => factor.strategy === "email_code",
  );

  const clerkError = useMemo(() => {
    return errors?.global?.[0]?.message;
  }, [errors]);

  const navigateAfterAuth = async () => {
    if (!signIn) return;
    const { error } = await signIn.finalize();
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
    if (!validateCredentials() || !signIn) return;

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFieldErrors({
        general: "Invalid email or password.",
      });
      return;
    }

    if (signIn.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    if (signIn.status === "needs_second_factor") {
      if (!emailCodeFactor) {
        setFieldErrors({
          general: "Additional verification is required to continue.",
        });
        return;
      }

      await signIn.emailCode.sendCode({
        emailAddressId: emailCodeFactor.emailAddressId,
      });
      return;
    }

    if (signIn.status === "needs_new_password") {
      setFieldErrors({
        general: "Additional verification is required to continue.",
      });
    }
  };

  const handleVerify = async () => {
    setFieldErrors({});
    if (!signIn) return;

    if (!code.trim()) {
      setFieldErrors({ code: "Enter the verification code" });
      return;
    }

    await signIn.emailCode.verifyCode({ code: code.trim() });

    if (signIn.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    setFieldErrors({
      general: "We couldn't verify that code. Please try again.",
    });
  };

  const handleResendCode = async () => {
    if (!signIn || !emailCodeFactor) return;
    await signIn.emailCode.sendCode({
      emailAddressId: emailCodeFactor.emailAddressId,
    });
  };

  if (!signIn) {
    return <AuthLoading />;
  }

  const isSecondFactorEmail =
    signIn?.status === "needs_second_factor" && Boolean(emailCodeFactor);

  if (isSecondFactorEmail) {
    return (
      <AuthPageLayout>
        <AuthBrand
          title="Verify your account"
          subtitle={`We sent a secure code to ${emailCodeFactor?.safeIdentifier || "your email"}.`}
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
              error={fieldErrors.code}
            />

            {fieldErrors.general || clerkError ? (
              <Text className="auth-error">
                {fieldErrors.general || clerkError}
              </Text>
            ) : null}

            <AuthButton label="Verify" onPress={handleVerify} loading={isBusy} />
            <AuthButton
              label="Resend code"
              variant="secondary"
              onPress={handleResendCode}
            />
          </View>
        </View>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthBrand
        title="Welcome back"
        subtitle="Sign in to keep every subscription in sync and under control."
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
            error={fieldErrors.email}
          />

          <View className="auth-field">
            <Text className="auth-label">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              placeholder="Enter your password"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              className={
                fieldErrors.password ? "auth-input auth-input-error" : "auth-input"
              }
            />
            {fieldErrors.password && (
              <Text className="auth-error">{fieldErrors.password}</Text>
            )}

            <Link href="/(auth)/forgot-password" className="self-start">
              <Text className="text-sm font-sans-semibold text-accent">
                Forgot password?
              </Text>
            </Link>
          </View>

          {fieldErrors.general || clerkError ? (
            <Text className="auth-error">
              {fieldErrors.general || clerkError}
            </Text>
          ) : null}

          <AuthButton label="Sign in" onPress={handleSubmit} loading={isBusy} />

          <View className="auth-divider-row">
            <View className="auth-divider-line" />
            <Text className="auth-divider-text">Trusted & secure</Text>
            <View className="auth-divider-line" />
          </View>

          <Text className="auth-helper text-center">
            Your data is encrypted and stored safely. You stay in control of
            every renewal.
          </Text>
        </View>
      </View>

      <AuthLinkRow
        question="New to Recurly?"
        linkLabel="Create an account"
        href="/(auth)/sign-up"
      />
    </AuthPageLayout>
  );
};

export default SignIn;
