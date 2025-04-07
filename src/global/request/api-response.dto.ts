export type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type ServiceResponse<T> = {
  data: T;
  success?: boolean;
  statusCode?: number;
  message?: string;
  meta?: PaginationMeta;
  error?: any;
};

/**
 * A union type for any service return type.
 * Use this in places where services might return either a standard or paginated response.
 */
export type ServiceResult<T> = ServiceResponse<T> | T;

/**
 * Lower-level HTTP wrapper return format (e.g., axios/fetch wrapper).
 * Use this for low-level transport response handling if needed.
 */
export type HttpResponse<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: any;
};
