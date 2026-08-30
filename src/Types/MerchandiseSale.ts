interface MerchandiseSale {
    id: number;
    name: string;
    external_id: string;
    username: string | null;
    message: string | null;
    amount: number;
    currency: string;
    bought_amount: number;
    is_shown: number;
    created_at: string;
    shown_at: string | null;
}

export default MerchandiseSale;
