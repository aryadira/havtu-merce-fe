export interface UserRole {
    id: string;
    slug: string;
    role_name: string;
    description: string;
    allowed_paths: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserRolePermissionsDto {
    allowed_paths: string[];
}
