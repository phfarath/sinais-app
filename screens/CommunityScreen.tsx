import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
}

type CommunityScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const posts: Post[] = [
  {
    id: 1,
    author: 'João S.',
    content: 'Hoje completo 30 dias sem apostar! Gratidão pelo apoio de todos.',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Maria L.',
    content: 'Alguém mais está usando a técnica de respiração? Tem me ajudado muito!',
    likes: 18,
    comments: 8,
  },
];

export default function CommunityScreen({ navigation }: CommunityScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Comunidade</Text>

      <ScrollView>
        <View style={styles.supportCard}>
          <MaterialCommunityIcons name="hand-heart" size={32} color="#4A90E2" />
          <Text style={styles.supportTitle}>Grupo de Apoio Online</Text>
          <Text style={styles.supportTime}>Próxima reunião: Hoje, 19h</Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Participar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Histórias da Comunidade</Text>

        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <MaterialCommunityIcons name="account-circle" size={40} color="#4A90E2" />
              <View style={styles.postAuthorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTime}>2h atrás</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>{post.content}</Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="heart-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="comment-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fabButton}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  supportCard: ViewStyle;
  supportTitle: TextStyle;
  supportTime: TextStyle;
  joinButton: ViewStyle;
  joinButtonText: TextStyle;
  sectionTitle: TextStyle;
  postCard: ViewStyle;
  postHeader: ViewStyle;
  postAuthorInfo: ViewStyle;
  authorName: TextStyle;
  postTime: TextStyle;
  postContent: TextStyle;
  postActions: ViewStyle;
  actionButton: ViewStyle;
  actionText: TextStyle;
  fabButton: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  supportCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  supportTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});