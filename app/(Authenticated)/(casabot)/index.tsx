import React, { useState, useRef, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import Colors from "@/assets/styles/colors";
import { router } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  Message,
  PropertyRecommendation,
} from "@/app/types/CasaBotConversation";
import { Timestamp } from "firebase/firestore";
import { createConversation } from "@/app/Firebase/libs/ai-messages/createConversation";
import getCurrentUserData from "@/app/hooks/users/getCurrentUserData";
import UserData from "@/app/types/UserData";
import { createMessage } from "@/app/Firebase/libs/ai-messages/createMessage";
import useFetchUserAIConversations from "@/app/hooks/ai/useFetchUserAIConversations";
import useRealtimeConversation from "@/app/hooks/ai/useRealtimeConversation";

const CasaBot: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(0)).current;

  const { messages, loading: messagesLoading } =
    useRealtimeConversation(conversationId);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: false });
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUserData();
      if (user) {
        setUserData(user);
        console.log("User Data:", user);
      }
    };

    fetchUserData();
  }, []);

  const { conversations, loading } = useFetchUserAIConversations(
    userData?.id as string
  );

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: drawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [drawerOpen]);

  const initializeConversation = async () => {
    try {
      const newConversationId = await createConversation({
        conversation: {
          createdAt: Timestamp.now(),
          createdBy: userData?.id as string,
          title: "",
          messages: [
            {
              text: "Hello! How can I assist you today?",
              isUser: false,
              createdAt: Timestamp.now(),
            },
          ],
        },
      });
      setConversationId(newConversationId);
      return newConversationId;
    } catch (error) {
      console.error("Error initializing conversation:", error);
      return null;
    }
  };

  const loadConversation = async (id: string) => {
    if (!id) return;

    setConversationId(id);
    setDrawerOpen(false);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      let currentConversationId = conversationId;

      if (currentConversationId === null) {
        currentConversationId = await initializeConversation();
        if (!currentConversationId) {
          console.error("Failed to create conversation");
          return;
        }
      }

      const userMessage: Message = {
        text: message,
        isUser: true,
        createdAt: Timestamp.now(),
      };

      setMessage("");
      setIsTyping(true);

      await createMessage({
        conversationId: currentConversationId,
        message: userMessage,
      });

      setTimeout(async () => {
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      {!item.isUser && (
        <Image
          source={require("@/assets/images/Icons/Dark-Icon.png")}
          style={styles.botAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.botMessageText,
          ]}
        >
          {item.text}
        </Text>
        {item.recommendations && (
          <View style={styles.recommendationsWrapper}>
            <Text style={styles.recommendationsLabel}>
              Suggested Properties:
            </Text>
            <FlatList
              data={item.recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id || Math.random().toString()}
              renderItem={({
                item: property,
              }: {
                item: PropertyRecommendation;
              }) => (
                <TouchableOpacity
                  style={styles.propertyCard}
                  onPress={() => {
                    // Navigate to property details
                    if ("maxTenants" in property) {
                      // This is an Apartment
                      router.push(
                        `/(Authenticated)/(apartments)/(viewapartment)/${property.id}`
                      );
                    } else {
                      // This is a Transient
                      router.push(
                        `/(Authenticated)/(transients)/(viewtransient)/${property.id}`
                      );
                    }
                  }}
                >
                  <View
                    style={[
                      styles.propertyImage,
                      !property.images?.length && styles.placeholderImage,
                    ]}
                  >
                    {property.images?.length ? (
                      <Image
                        source={{ uri: property.images[0] }}
                        style={styles.propertyImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <FontAwesome5
                        name="building"
                        size={40}
                        color={Colors.secondaryText}
                      />
                    )}
                    <View style={styles.propertyPriceTag}>
                      <Text style={styles.propertyPriceText}>
                        ₱{property.price.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {property.title}
                    </Text>
                    <Text style={styles.propertyAddress} numberOfLines={1}>
                      {property.address}
                    </Text>
                    <View style={styles.propertyFeatures}>
                      {"maxTenants" in property ? (
                        // Apartment specific features
                        <>
                          <View style={styles.featureItem}>
                            <Ionicons
                              name="bed-outline"
                              size={14}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.bedRooms}
                            </Text>
                          </View>
                          <View style={styles.featureItem}>
                            <FontAwesome5
                              name="bath"
                              size={12}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.bathRooms}
                            </Text>
                          </View>
                          <View style={styles.featureItem}>
                            <MaterialIcons
                              name="people-outline"
                              size={14}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.maxTenants}
                            </Text>
                          </View>
                        </>
                      ) : (
                        // Transient specific features
                        <>
                          <View style={styles.featureItem}>
                            <Ionicons
                              name="bed-outline"
                              size={14}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.bedRooms}
                            </Text>
                          </View>
                          <View style={styles.featureItem}>
                            <FontAwesome5
                              name="bath"
                              size={12}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.bathRooms}
                            </Text>
                          </View>
                          <View style={styles.featureItem}>
                            <MaterialIcons
                              name="people-outline"
                              size={14}
                              color={Colors.secondaryText}
                            />
                            <Text style={styles.featureText}>
                              {property.maxGuests}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={styles.emptyRecommendations}>
                  No properties found
                </Text>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.topBar}>
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={Colors.primaryBackground}
              style={{ marginRight: 5 }}
            />
          </TouchableWithoutFeedback>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15, flex: 1 }}>
            <Text style={styles.greetings}>CasaBot</Text>
            <Text style={styles.subtext}>Your AI Assistant</Text>
          </View>
          <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>
            <Ionicons name="list" size={26} color={Colors.primaryBackground} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          style={styles.messagesContainer}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.text + "_" + Math.random()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={
            messagesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading messages...</Text>
              </View>
            ) : (
              renderMessage({
                item: {
                  text: "Hello! How can I assist you today?",
                  isUser: false,
                  createdAt: Timestamp.now(),
                },
              })
            )
          }
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>CasaBot is typing</Text>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isTyping && styles.inputDisabled]}
            value={message}
            onChangeText={setMessage}
            placeholder={
              isTyping
                ? "Please wait..."
                : "Ask me about apartments or transients..."
            }
            placeholderTextColor={Colors.secondaryText}
            multiline
            editable={!isTyping}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || isTyping) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isTyping}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                !message.trim() || isTyping
                  ? Colors.secondaryText
                  : Colors.primaryBackground
              }
            />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.historyDrawer,
            {
              right: drawerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-250, 0],
              }),
              opacity: drawerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Chat History</Text>
            <TouchableOpacity onPress={() => setDrawerOpen(false)}>
              <Ionicons name="close" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.drawerLoading}
            />
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id + "_" + Math.random()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.historyItem,
                    item.id === conversationId && styles.activeHistoryItem,
                  ]}
                  onPress={() => loadConversation(item.id as string)}
                >
                  <Text style={styles.historyItemDate}>
                    {item.createdAt &&
                      new Date(item.createdAt.toDate()).toLocaleDateString()}
                  </Text>
                  <Text
                    style={styles.historyItemTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title ||
                      (item.messages &&
                        item.messages[0]?.text.substring(0, 25) + "...") ||
                      "New Chat"}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={styles.emptyHistory}>No chat history found</Text>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              setConversationId(null);
              setDrawerOpen(false);
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={Colors.primaryBackground}
            />
            <Text style={styles.newChatButtonText}>New Chat</Text>
          </TouchableOpacity>
        </Animated.View>

        {drawerOpen && (
          <TouchableWithoutFeedback onPress={() => setDrawerOpen(false)}>
            <Animated.View
              style={[styles.overlay, { opacity: drawerAnimation }]}
            />
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  greetings: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: {
    fontSize: 14,
    color: Colors.primaryBackground,
  },
  messagesContainer: {
    flex: 1,
    marginTop: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  botMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 5,
    marginLeft: 40,
  },
  botBubble: {
    backgroundColor: Colors.alternate,
    borderBottomLeftRadius: 5,
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: Colors.primaryBackground,
  },
  botMessageText: {
    color: Colors.primaryText,
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    marginLeft: 0,
    marginRight: 0,
  },
  input: {
    backgroundColor: Colors.border,
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.7,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 40,
  },
  typingText: {
    marginRight: 10,
    color: Colors.secondaryText,
    fontSize: 14,
  },
  historyDrawer: {
    position: "absolute",
    top: 0,
    width: 250,
    height: "100%",
    backgroundColor: Colors.primaryBackground,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 50,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeHistoryItem: {
    backgroundColor: Colors.border,
  },
  historyItemDate: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  historyItemTitle: {
    fontSize: 16,
    color: Colors.primaryText,
  },
  emptyHistory: {
    padding: 20,
    textAlign: "center",
    color: Colors.secondaryText,
  },
  drawerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    margin: 15,
    borderRadius: 8,
  },
  newChatButtonText: {
    color: Colors.primaryBackground,
    marginLeft: 8,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.secondaryText,
  },
  recommendationsWrapper: {
    marginTop: 10,
    marginBottom: 5,
  },
  recommendationsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: 8,
  },
  propertyCard: {
    width: 220,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.secondaryBackground,
    position: "relative",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  propertyPriceTag: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
  },
  propertyPriceText: {
    color: Colors.primaryBackground,
    fontWeight: "bold",
    fontSize: 12,
  },
  propertyInfo: {
    padding: 10,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  propertyAddress: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 5,
  },
  propertyFeatures: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 5,
  },
  emptyRecommendations: {
    padding: 10,
    color: Colors.secondaryText,
    fontStyle: "italic",
  },
});

export default CasaBot;
