import { Href } from "expo-router";
import { Firestore, Timestamp } from "firebase/firestore";
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  ImageStyle,
  PressableProps,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};
export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};
export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};



export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  //   label?: string;
  //   error?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

/** Kullanıcı bilgilerini temsil eden tür */
export type UserType = {
    uid?: string;
    email?: string | null;
    name?: string | null;
    university?: string;
    department?: string;
    image?: string;
    gender?:string;
  } |null;

  /** İlan türü */
export type ListingType = {
    id: string;
    title: string;
    description: string;
    category: "Ders Notları" | "Kitap" | "Eşya" | "Gönüllü Yardım";
    ownerId: string;
    createdAt: Date;
    images?: string[];
    contactMethod: "Email" | "Telefon";
    status: "Aktif" | "Pasif";
  };
export type UserDataType = {
  name: string;
  image?: any;
  university?:string;
  department?:string;
  gender?:string;
};


export type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

// types.tsx içinde TEKRARLAMAYAN interface tanımları yapın:
export interface University {
  name: string;
  phone: string;
  fax: string;
  website: string;
  email: string;
  adress: string; // Not: "address" olmalıydı, JSON ile uyumlu kalması için böyle bırakıldı
  rector: string;
}

export interface Province {
  id: number;
  province: string;
  universities: University[];
}

export type ProvinceUniversities = Province[]; // Doğru tanım