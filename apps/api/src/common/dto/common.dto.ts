export class PaginationDto {
  page: number = 1;
  pageSize: number = 10;
}

export class QueryDto extends PaginationDto {
  search?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc' = 'desc';
}

export class ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return { success: true, data, message };
  }
  
  static error(message: string, data?: any): ApiResponse {
    return { success: false, data, message };
  }
}

export class PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(items: T[], total: number, page: number, pageSize: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}

export function parseBoolean(value: string): boolean {
  return value === 'true' || value === '1';
}

export function getOrderByClause(sortBy?: string, sortOrder?: 'asc' | 'desc') {
  if (!sortBy) return { createdAt: 'desc' as const };
  return { [sortBy]: sortOrder || 'desc' };
}
