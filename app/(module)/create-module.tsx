import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { BASE_URL } from "@/utils/endpoints";

const CreateModule = ({ courseId }: { courseId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [doc, setDoc] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = (type: "success" | "error", text1: string, text2?: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
    });
  };

  const handleCreateModule = async (): Promise<void> => {
    if (!title.trim()) {
      showToast("error", "Module Title is required", "Please enter a title for the module.");
      return;
    }

    if (!description.trim()) {
      showToast("error", "Module Description is required", "Please provide a description.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description,
        resources: {
          doc: doc.trim(),
          video: video.trim(),
        },
        courseId, // Associate the module with a course
      };

      const response = await axios.post(`${BASE_URL}/api/modules`, payload);

      if (response.status === 201) {
        showToast("success", "Module created successfully!", "Now add resources if required.");
        setTitle("");
        setDescription("");
        setDoc("");
        setVideo("");
      }
    } catch (error) {
      console.error("Error creating module:", error);
      showToast("error", "Failed to create module!", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6">
      <Text style={{ fontFamily: "Font" }} className="text-2xl text-orange-500 mb-6">
        Create a New Module
      </Text>

      <ScrollView className="rounded-lg h-[80vh]">
        {/* Title */}
        <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
          Module Title
        </Text>
        <TextInput
          style={{ fontFamily: "Font" }}
          value={title}
          onChangeText={setTitle}
          className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
        />

        {/* Description */}
        <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
          Module Description
        </Text>
        <View style={{ height: 200 }} className="border border-gray-300 rounded-lg mb-4">
          <WebView
            source={{
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 10px; margin: 0; }
                      textarea { width: 100%; height: 100%; border: none; outline: none; font-size: 16px; }
                    </style>
                  </head>
                  <body>
                    <textarea id="editor" placeholder="Type your description here..."></textarea>
                    <script>
                      const editor = document.getElementById('editor');
                      editor.addEventListener('input', () => {
                        window.ReactNativeWebView.postMessage(editor.value);
                      });
                    </script>
                  </body>
                </html>
              `,
            }}
            onMessage={(event) => setDescription(event.nativeEvent.data)}
          />
        </View>

        {/* Document */}
        <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
          Document URL (Optional)
        </Text>
        <TextInput
          style={{ fontFamily: "Font" }}
          value={doc}
          onChangeText={setDoc}
          className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
        />

        {/* Video */}
        <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
          Video URL (Optional)
        </Text>
        <TextInput
          style={{ fontFamily: "Font" }}
          value={video}
          onChangeText={setVideo}
          className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
        />
      </ScrollView>

      <TouchableOpacity
        onPress={handleCreateModule}
        className={`p-4 rounded-2xl ${loading ? "bg-gray-500" : "bg-orange-500"}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={{ fontFamily: "Font" }} className="text-white text-center">
            Create Module
          </Text>
        )}
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

export default CreateModule;
