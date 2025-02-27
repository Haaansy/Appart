interface Owner {
    firstName?: string;
    lastName?: string;
    rating?: number;
    ownerID?: string;
}

export interface Transient {
    owner?: Owner;
    images: string[];
    title: string;
    status: string;
    address: string;
    coordinates: number[];
    price: number;
    description: string;
    tags: string[];
    bedRooms: number;
    bathRooms: number;
    kitchen: number;
    livingRooms: number;
    parking: number;
    maxGuests: number;
    houseRules: string[];
    requirements: string[];
    createdAt: number;
    id?: string;
}