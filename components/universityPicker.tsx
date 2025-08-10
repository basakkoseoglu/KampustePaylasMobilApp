import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import ModalWrapper from "@/components/ModalWrapper";
import provinceUniversities from "../json/province-universities.json";
import * as Icons from "phosphor-react-native";

interface UniversityPickerProps {
  value: string;
  onChange: (university: string) => void;
  placeholder?: string;
}

const UniversityPicker: React.FC<UniversityPickerProps> = ({
  value,
  onChange,
  placeholder = "Üniversite Seçiniz",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [allUniversities, setAllUniversities] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  // const formatUniversityName = (name: string): string => {
  //   return name
  //     .toLowerCase()
  //     .split(' ')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // };
  // Türkçe karakter desteği için geliştirilmiş fonksiyon
  const formatUniversityName = (name: string): string => {
    // Türkçe karakterleri de doğru şekilde dönüştüren toLocaleLowerCase kullanılıyor
    const turkishLowerCase = name.toLocaleLowerCase("tr-TR");

    return turkishLowerCase
      .split(" ")
      .map((word) => {
        if (word.length === 0) return "";
        // İlk harfi Türkçe kurallarına göre büyük yap
        return word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1);
      })
      .join(" ");
  };

  useEffect(() => {
    const allUniversityNames = provinceUniversities.flatMap((province) =>
      province.universities.map((university) =>
        formatUniversityName(university.name)
      )
    );
    allUniversityNames.sort((a, b) => a.localeCompare(b, "tr-TR"));
    setAllUniversities(allUniversityNames);
    setUniversities(allUniversityNames);
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setUniversities(allUniversities);
    } else {
      const filteredUniversities = allUniversities.filter((university) =>
        university
          .toLocaleLowerCase("tr-TR")
          .includes(text.toLocaleLowerCase("tr-TR"))
      );
      setUniversities(filteredUniversities);
    }
  };

  const openModal = () => {
    setSearchText("");
    setUniversities(allUniversities);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.selectContainer}>
        <Typo
          color={value ? colors.black : colors.neutral100}
          style={styles.placeholderText}
        >
          {value ? value : placeholder}
        </Typo>
        <Icons.CaretDown size={18} color={colors.black} />
      </TouchableOpacity>

      {showModal && (
        <ModalWrapper>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icons.X size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Üniversite Ara..."
                placeholderTextColor={colors.neutral300}
                value={searchText}
                onChangeText={handleSearch}
                autoFocus
              />
            </View>

            <ScrollView
              style={styles.listContainer}
              showsVerticalScrollIndicator={true}
            >
              {universities.length > 0 ? (
                universities.map((university) => (
                  <TouchableOpacity
                    key={university}
                    onPress={() => {
                      onChange(university);
                      setShowModal(false);
                    }}
                    style={styles.optionItem}
                  >
                    <Typo color={colors.black} style={styles.optionText}>
                      {university}
                    </Typo>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Typo color={colors.neutral300}>Sonuç bulunamadı</Typo>
                </View>
              )}
            </ScrollView>
          </View>
        </ModalWrapper>
      )}
    </>
  );
};

export default UniversityPicker;

const styles = StyleSheet.create({
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._17,
    backgroundColor: colors.neutral100,
  },
  placeholderText: {
    fontSize: verticalScale(16),
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    margin: spacingX._15,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacingX._10,
    paddingTop: spacingY._10,
  },
  closeButton: {
    padding: spacingX._5,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    padding: spacingX._12,
  },
  searchInput: {
    fontSize: verticalScale(16),
    padding: spacingY._7,
    color: colors.black,
  },
  listContainer: {
    maxHeight: verticalScale(300),
  },
  optionItem: {
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: verticalScale(16),
  },
  emptyContainer: {
    padding: spacingY._20,
    alignItems: "center",
  },
});
