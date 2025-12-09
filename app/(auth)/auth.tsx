// ============================================
// screens/Auth.tsx
// ============================================
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Lock, Mail, Plane, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AuthProps {
  navigation: any; // Replace with proper navigation type
}

const Auth = ({ navigation }: AuthProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { signIn, signUp, user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      let message = error.message;
      if (error.message === "Invalid login credentials") {
        message = "Incorrect email or password";
      }
      Alert.alert("Sign In Error", message);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const { error } = await signUp(email, password, displayName);
    setIsSubmitting(false);

    if (error) {
      let message = error.message;
      if (error.message?.includes("already registered")) {
        message = "This email is already registered";
      }
      Alert.alert("Sign Up Error", message);
    } else {
      Alert.alert(
        "Account Created Successfully",
        "Please check your email to verify your account"
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Plane size={32} color="#6366f1" />
              </View>
              <Text style={styles.title}>Travel Itinerary Planner</Text>
              <Text style={styles.subtitle}>
                Sign in to get personalized travel assistance
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "signin" && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab("signin")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "signin" && styles.tabTextActive,
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "signup" && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab("signup")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "signup" && styles.tabTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Form */}
              {activeTab === "signin" && (
                <View style={styles.form}>
                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                      <Mail size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSignIn}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Sign Up Form */}
              {activeTab === "signup" && (
                <View style={styles.form}>
                  {/* Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name (optional)</Text>
                    <View style={styles.inputContainer}>
                      <User size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Your name"
                        placeholderTextColor="#999"
                        value={displayName}
                        onChangeText={setDisplayName}
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                      <Mail size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSignUp}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        Create Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#000",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    textAlign: "right",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Auth;
