import { UserGender } from "../app/(public)/profile/schema";

export interface CurrentUserResponse {
    id: string;
    user_role_id: string;
    role_slug: string;
    username: string;
    email: string;
    profile: {
        id: string;
        user_id: string;
        fullname: string;
        avatar: string;
    };
}