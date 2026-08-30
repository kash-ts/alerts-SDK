interface Merchandise {
    id: number;
    merchant: {
        identifier: string;
        name: string;
    };
    identifier: string;
    title: Record<string, string>;
    is_active: 0 | 1;
    is_percentage: 0 | 1;
    currency: string;
    price_user: number;
    price_service: number;
    url: string | null;
    img_url: string | null;
    end_at: string | null;
}

export default Merchandise;
