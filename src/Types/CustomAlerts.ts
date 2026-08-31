interface CustomAlerts {
    id: number;
    external_id: string | null;
    header: string | null;
    message: string | null;
    image_url: string | null;
    sound_url: string | null;
    is_shown: 0 | 1;
    created_at: string;
    shown_at: string | null;
}

export default CustomAlerts;
