export interface UpdateRequestBody {
    imageId: string;
    x: number;
    y: number;
    colour: string;
}

export interface CreateRequestBody {
    imageId: string;
    width: number;
    height: number;
    colour: string;
}
