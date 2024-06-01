export class User {
  uid!: string;
  email!: string;
  emailVerified!: boolean;
  displayName!: string;
  photoURL?: string;
  phoneNumber!: string;
  disabled!: boolean;
  isAdmin!: boolean;
  creationTime!: string;
  verifyTokens?: string;
  favoriteFairsRef!: Fair[];
  favoriteStandsRef!: Stand[];
  favoriteProductsRef!: Product[];
  ownerFairsRef!: Fair[];
  ownerStandsRef!: Stand[];
}

export class FairPhotograph {
  id?: string;
  name!: string;
  description!: string;
  creationTime!: string;
  isCover!: boolean;
  fileId!: string;
  url!: string;
  parent!: Fair;
}

export class StandPhotograph {
  id?: string;
  name!: string;
  description!: string;
  creationTime!: string;
  isCover!: boolean;
  fileId!: string;
  url!: string;
  parent!: Stand;
}

export class Fair {
  address!: string;
  celebrationDate!: string;
  contactEmail!: string;
  contactPhone!: string;
  creationTime!: string;
  description!: string;
  geopoint!: [number, number];
  id!: string;
  name!: string;
  owner!: User;
  photographs!: FairPhotograph[];
  stars!: number;
  type!: "entrepreneurship" | "gastronomic";
  coverUrl?: string;
  standRefs!: Stand[];
}

export class Stand {
  id!: string;
  name!: string;
  creationTime!: string;
  coverUrl?: string;
  description!: string;
  owner!: User;
  slogan?: string;
  stars!: number;
  photographs!: StandPhotograph[];
  contactEmail!: string;
  contactPhone!: string;
  fairRefs!: Fair[];
}

export class FairPost {
  id?: string;
  text!: string;
  creationTime?: string;
  parent!: string;
  parentName?: string;
  parentPhoto?: string;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  fairId!: Fair;
}

export class StandPost {
  id?: string;
  text!: string;
  creationTime?: string;
  parent!: string;
  parentName?: string;
  parentPhoto?: string;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  standId!: Stand;
}

export class FairReview {
  id!: string;
  comment!: string;
  stars!: number;
  owner!: User;
  parent!: Fair;
  creationTime!: string;
}

export class StandReview {
  id!: string;
  comment!: string;
  stars!: number;
  owner!: User;
  parent!: Stand;
  creationTime!: string;
}

export class NotificationToken {
  token!: string;
  deviceID!: string;
  userRef!: User;
}

export class Invitation {
  id!: string;
  sentBy!: string;
  fairRef!: Fair;
  standRef!: Stand;
  fairOwnerRef!: User;
  standOwnerRef!: User;
  type!: "STAND_INVITATION" | "FAIR_REQUEST";
  fairID!: string;
  standID!: string;
}

export class Product {
  id!: string;
  name!: string;
  description!: string;
  price!: string;
  type!: "clothes" | "accessories" | "drinks" | "candies" | "foods";
  currency!: "Bs." | "$";
  parent!: Stand;
  creationTime?: string;
  fileId!: string;
  fileUrl!: string;
  fileName!: string;
}
