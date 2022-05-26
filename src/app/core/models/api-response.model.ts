export interface ApiResponse<T> {
    code: 1000 | 1001 | 500 | 501 | 300 | 303 | 304 | 503 | number;
    status: 'ERROR' | 'INTERNAL_ERROR' | 'SUCCESS' | 'FIELD_ADD_ERROR' | 'FIELD_AREA_ERROR' | string;
    message: string;

    data: T;
}
