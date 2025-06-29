import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const Task = ({ taskModel, onIconPress, onDelete }) => {
  const { text, completed } = taskModel;
  const animation = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: completed ? 1 : 0,
      duration: 300,
      useNativeDriver: true, // opacity kan animas med native driver
    }).start();
  }, [completed]);

  // Animera opaciteten från 1 (normal) till 0.5 (avmattad)
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <Animated.View style={[styles.item, { opacity }]}>
      <View style={styles.itemLeft}>
        <TouchableOpacity onPress={() => onIconPress(taskModel)}>
          <Icon
            name={completed ? "check-circle" : "circle"}
            size={24}
            color={completed ? "#4CAF50" : "#55BCF6"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.itemText,
            taskModel.completed && styles.itemTextCompleted,
          ]}
        >
          {taskModel.text}
        </Text>
      </View>

      <TouchableOpacity onPress={() => onDelete(taskModel)}>
        <Icon name="trash-2" size={20} color="#FF4C4C" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemText: {
    maxWidth: "80%",
    marginLeft: 10,
    fontSize: 16,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#A9A9A9",
  },
});

export default Task;
