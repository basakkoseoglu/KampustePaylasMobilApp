import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors } from '@/constants/theme';
import * as Icons from 'phosphor-react-native';
import provinceUniversities from '@/json/province-universities.json';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {  query, where, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/authContext'; // Auth sisteminden kullanıcı bilgilerini almak için
import { startChat } from '@/services/chatService';


interface Post {
  id: string;
  ownerId: string; 
  ownerName: string;
  ownerUniversity: string;
  ownerImage: string;
  title: string;
  type: string; // Firestore collection name (e.g., 'notesAds')
}

const POST_TYPES = [
  { label: 'Kitap/Not', value: 'notesAds' },
  { label: 'Eşya Paylaşımı', value: 'loanAds' },
  { label: 'Yardımlaşma', value: 'volunteerAds' },
  { label: 'Etkinlik', value: 'eventAds' },
];

const Discover = () => {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [allUniversities, setAllUniversities] = useState<string[]>([]);
  const [universitySearchText, setUniversitySearchText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();


  useEffect(() => {
    const formatUniversityName = (name: string): string => {
      return name.split(' ').map(word => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR')).join(' ');
    };
    const allUniversityNames = provinceUniversities.flatMap(province =>
      province.universities.map(university => formatUniversityName(university.name))
    );
    allUniversityNames.sort((a, b) => a.localeCompare(b, 'tr-TR'));
    const universitiesWithAllOption = ['Tümü', ...allUniversityNames];
    setAllUniversities(universitiesWithAllOption);
    setUniversities(universitiesWithAllOption);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const allData: Post[] = [];
      const collections = ['loanAds', 'notesAds', 'volunteerAds', 'eventAds'];
      for (const name of collections) {
        const snap = await getDocs(collection(db, name));
        snap.forEach(doc => {
          const d = doc.data();
          allData.push({
            id: doc.id,
            ownerId: d.ownerUid,
            ownerName: d.ownerName,
            ownerUniversity: d.ownerUniversity,
            ownerImage: d.ownerImage || '',
            title: d.itemTitle || d.courseTitle || d.adTitle || d.ilanBasligi || 'İlan',
            type: name // Firestore collection name
          });
        });
      }
      setPosts(allData);
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesType = selectedType === null || post.type === selectedType;
    const matchesUniversity = selectedUniversity === '' || selectedUniversity === 'Tümü' || post.ownerUniversity.includes(selectedUniversity);
    return matchesType && matchesUniversity;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? `${parts[0][0]}.${parts[parts.length - 1][0]}` : name.slice(0, 2);
  };

  const handlePostPress = (post: Post) => {
    router.push({
     pathname:'/post-detail',
      params: {
        id: post.id,
        type: post.type
     }
   });
  };
  const handleStartChat = async (post: Post) => {
    if (!user?.uid || !user?.name) return;
    const chatId = await startChat({
      currentUserId: user?.uid,
      currentUserName: user?.name,
      receiverId: post.ownerId,
      receiverName: post.ownerName,
    });
  
    router.push({
      pathname: '/MessagingScreen',
      params: {
        chatId,
        receiverName: post.ownerName,
        currentUserId: user?.uid,
        username: user?.name,
      },
    });
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {item.ownerImage ? (
              <Image source={{ uri: item.ownerImage }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(item.ownerName)}</Text>
            )}
          </View>
          <View>
            <Text style={styles.userName}>{item.ownerName}</Text>
            <View style={styles.universityRow}>
              <Icons.MapPin size={14} color={colors.neutral400} style={{ marginRight: 4 }} />
              <Text style={styles.universityText}>{item.ownerUniversity}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => handlePostPress(item)}>
          <Text style={styles.detailsText}>Detayları görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={()=>handleStartChat(item)}>
          <Text style={styles.contactButtonText}>İlgileniyorum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper style={styles.container}>
      {/* Üniversite seçici */}
      <View style={styles.universityPickerContainer}>
        <TouchableOpacity onPress={() => setShowUniversityModal(!showUniversityModal)} style={styles.selectContainer}>
          <Text style={selectedUniversity ? styles.selectText : styles.placeholderText}>
            {selectedUniversity || 'Okul seçiniz'}
          </Text>
          <Icons.CaretDown size={18} color={colors.black} />
        </TouchableOpacity>
        {showUniversityModal && (
          <View style={styles.dropdown}>
            <TextInput
              style={styles.searchInput}
              placeholder="Üniversite Ara..."
              placeholderTextColor={colors.neutral300}
              value={universitySearchText}
              onChangeText={text => {
                setUniversitySearchText(text);
                setUniversities(text ? allUniversities.filter(u => u.toLocaleLowerCase('tr-TR').includes(text.toLocaleLowerCase('tr-TR'))) : allUniversities);
              }}
            />
            <FlatList
              data={universities}
              keyExtractor={(item) => item}
              style={{ maxHeight: 250 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUniversity(item);
                    setShowUniversityModal(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* İlan Türü Seçici */}
      <View style={styles.typeContainer}>
        <TouchableOpacity style={styles.typeButton} onPress={() => setShowTypeModal(!showTypeModal)}>
          <Text style={styles.typeButtonText}>
            {selectedType ? POST_TYPES.find(t => t.value === selectedType)?.label : 'İlan türü seçin'}
          </Text>
          <Icons.CaretDown size={18} color={colors.black} />
        </TouchableOpacity>
        {showTypeModal && (
          <View style={styles.typeModal}>
            <TouchableOpacity style={styles.typeOption} onPress={() => { setSelectedType(null); setShowTypeModal(false); }}>
              <Text style={styles.typeOptionText}>Tümü</Text>
            </TouchableOpacity>
            {POST_TYPES.map(({ label, value }) => (
              <TouchableOpacity key={value} style={styles.typeOption} onPress={() => { setSelectedType(value); setShowTypeModal(false); }}>
                <Text style={styles.typeOptionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* İlan Listesi */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

export default Discover;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  universityPickerContainer: {
    marginBottom: 12,
    padding: 16
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  selectText: {
    fontSize: 14,
    color: colors.black
  },
  placeholderText: {
    fontSize: 14,
    color: colors.neutral300
  },
  searchInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    fontSize: 16,
    backgroundColor: colors.neutral100,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginTop: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  dropdownItemText: {
    fontSize: 16
  },
  typeContainer: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  typeButtonText: {
    fontSize: 16,
    color: colors.neutral300
  },
  typeModal: {
    marginTop: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    elevation: 5,
    zIndex: 20,
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  typeOptionText: {
    fontSize: 16
  },
  postsList: {
    padding: 16
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  userName: {
    fontSize: 14,
    fontWeight: '600'
  },
  universityText: {
    fontSize: 12,
    color: colors.neutral400
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 16
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailsText: {
    fontSize: 14,
    color: colors.neutral400,
    textDecorationLine: 'underline'
  },
  contactButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  universityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});