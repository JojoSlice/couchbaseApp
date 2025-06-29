import React, { useState, useContext, useEffect } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DatabaseContext } from "../context/DatabaseContext";
import Task from "../components/Task.js";
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import TaskModel from "../models/TaskModel";

export default function Index() {

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const { databaseService } = useContext(DatabaseContext);


  useEffect(() => {
    const fetchTasks = async () => {
      const tasksFromDb = await databaseService.getAllTasks();
      setTaskItems(tasksFromDb);
    };

    fetchTasks(); // hämta direkt vid start

    const interval = setInterval(() => {
      fetchTasks(); // hämta var 5:e sekund
    }, 5000);

    return () => clearInterval(interval); // rensa intervallet vid unmount
  }, []);



  const handleTaskAdd = async () => {
    Keyboard.dismiss();
    if (task?.trim()) {
      const newTask = new TaskModel({ text: task.trim() });
      await databaseService.addTask(newTask); // Spara i DB
      setTaskItems([...taskItems, newTask]);  // Uppdatera UI
      setTask(null);
    }
  };


  const toggleTaskCompleted = async (task) => {
    const updatedTask = new TaskModel({
      ...task,
      completed: !task.completed,
    });

    await databaseService.updateTask(updatedTask);

    const itemsCopy = taskItems.map(t => t._id === task._id ? updatedTask : t);
    setTaskItems(itemsCopy);
  };


  const deleteTask = async (task) => {
    await databaseService.deleteTask(task._id);
    const index = taskItems.findIndex(t => t._id === task._id);
    const itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    setLastDeletedTask({ item: task, index });
    setSnackbarVisible(true);
  };



  const undoDelete = async () => {
    if (lastDeletedTask) {
      await databaseService.addTask(lastDeletedTask.item);
      const itemsCopy = [...taskItems];
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
                  key={item.id ?? index}
                  taskModel={item}
                  onIconPress={(task) => toggleTaskCompleted(task)}
                  onDelete={(task) => deleteTask(task)}
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

