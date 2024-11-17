import { View, Text, Module } from "react-native";
import React from "react";
import { Modules } from "@/types/types";
import ModuleCard from "./ModuleCard";
interface ModuleListProps {
  modulesData: Modules | undefined;
  isLoading: boolean;
  onLoadMore: () => void;
}
const ModuleList: React.FC<ModuleListProps> = ({
  modulesData,
  isLoading,
  onLoadMore,
}) => {
  return (
    <View>
      {modulesData?.total === 0 ? (
        <Text style={{ fontFamily: "Font" }}>No modules yet...</Text>
      ) : (
        <View>
          <Text style={{ fontFamily: "Font" }}>
            Course Modules: {modulesData?.total}
          </Text>
          <View>
            {modulesData?.modules.map((module, index) => (
              <View key={index}>
                <ModuleCard module={module}/>
              </View>))
            }
            </View>
        </View>
      )}
    </View>
  );
};

export default ModuleList;
