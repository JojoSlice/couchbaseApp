import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Task from "../components/Task.js";
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';

export default function Index() {

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleTaskAdd = () => {
    Keyboard.dismiss();
    if (task?.trim()) {
      setTaskItems([...taskItems, { text: task.trim(), completed: false }]);
      setTask(null);
    }
  }

  const toggleTaskCompleted = (index) => {
    if (taskItems[index]) {
      const itemsCopy = [...taskItems];
      itemsCopy[index].completed = !itemsCopy[index].completed;
      setTaskItems(itemsCopy);
    }
  };

  const deleteTask = (index) => {
    const deleted = taskItems[index];
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    setLastDeletedTask({ item: deleted, index });
    setSnackbarVisible(true);
  };

  const undoDelete = () => {
    if (lastDeletedTask) {
      let itemsCopy = [...taskItems];
      itemsCopy.splice(lastDeletedTask.index, 0, lastDeletedTask.item);
      setTaskItems(itemsCopy);
      setLastDeletedTask(null);
      setSnackbarVisible(false);
    }
  };

  return (
    <PaperProvider>
      <View
        style={styles.container}
      >
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>

          <View style={styles.items}>
            {
              taskItems.map((item, index) => (
                <Task
                  key={index}
                  text={item.text}
                  completed={item.completed}
                  onIconPress={() => toggleTaskCompleted(index)}
                  onDelete={() => deleteTask(index)}
                />
              ))}
          </View>

        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}>

          <TextInput style={styles.input} placeholder={"Write a task"} value={task} onChangeText={text => setTask(text)} />

          <TouchableOpacity onPress={() => handleTaskAdd()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'Undo',
            onPress: () => {
              undoDelete();
            },
          }}
        >
          Task deleted
        </Snackbar>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
});

