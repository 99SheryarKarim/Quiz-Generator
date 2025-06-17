import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const difficulties = ['Easy', 'Medium', 'Hard'];
const questionTypes = ['Multiple Choice', 'True/False'];

interface GenerateAIModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (topic: string, difficulty: string, type: string) => void;
  isLoading: boolean;
}

export const GenerateAIModal: React.FC<GenerateAIModalProps> = ({ visible, onClose, onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [type, setType] = useState(questionTypes[0]);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}> 
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Generate with AI 🤖</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter topic or keyword"
            value={topic}
            onChangeText={setTopic}
            editable={!isLoading}
          />
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={difficulty}
              onValueChange={setDifficulty}
              enabled={!isLoading}
              style={styles.picker}
            >
              {difficulties.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Question Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={type}
              onValueChange={setType}
              enabled={!isLoading}
              style={styles.picker}
            >
              {questionTypes.map((t) => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={[styles.generateButton, isLoading && styles.disabledButton]}
            onPress={() => onGenerate(topic, difficulty, type)}
            disabled={isLoading || !topic.trim()}
          >
            <Text style={styles.generateButtonText}>{isLoading ? 'Generating...' : 'Generate'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'stretch',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GenerateAIModal; 