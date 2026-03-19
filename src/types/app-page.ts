export interface AppPage {
    id: string;
    path: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAppPageDto {
    path: string;
    name: string;
    description?: string;
}

export interface UpdateAppPageDto extends Partial<CreateAppPageDto> {}
