interface Owner {
    firstName?: string;
    lastName?: string;
    rating?: number;
    ownerID?: string;
}

export interface Apartment {
    owner?: Owner;
    images: string[];
    title: string;
    status: string;
    address: string;
    coordinates: number[];
    price: number;
    securityDeposit: number;
    description: string;
    tags: string[];
    bedRooms: number;
    bathRooms: number;
    kitchen: number;
    livingRooms: number;
    parking: number;
    area: number;
    levels: number;
    maxTentants: number;
    electricIncluded: boolean;
    waterIncluded: boolean;
    internetIncluded: boolean;
    houseRules: string[];
    requirements: string[];
    leaseTerms: number[];
    createdAt: number;
    id?: string;
}